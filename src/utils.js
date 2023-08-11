import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  where,
  query,
  orderBy,
  startAfter,
  limit,
} from 'firebase/firestore';
import { v4 as uuidV4 } from 'uuid';
import moment from 'moment';
import { resetUserState, setLogin } from './state';
import { auth, db } from '../firebase.config';
import { signOut } from 'firebase/auth';

export const updateCurrentUserState = (user, dispatch) => {
  dispatch(setLogin(user));
};

export const incrementByOne = (value) => value + 1;

export const isAvailable = (value) => (value ? true : false);

export const serializeDataBeforeSendingToDb = (value) => JSON.stringify(value);

export const makeDateReadable = (date) => {
  const relativeDate = moment(date);
  const currDate = moment();
  const duration = moment.duration(relativeDate.diff(currDate));
  return duration.humanize(true).toString();
};

export const deserializeDataFromDb = (value) => value && JSON.parse(value);

export const deserializeUserInAnswersFromDb = (answers) => {
  return answers.map((answer) => {
    return { ...answer, user: deserializeDataFromDb(answer?.user) };
  });
};

export const getAnswersFromDb = async (questionId) => {
  const answersCollectionRef = collection(
    db,
    'questions',
    questionId,
    'answers'
  );
  const res = await getDocs(
    query(answersCollectionRef, where('pId', '==', null))
  );
  const answerDocuments = res.docs;
  const answers = answerDocuments.map((answer) => {
    return { ...answer.data(), documentId: answer.id };
  });
  return deserializeUserInAnswersFromDb(answers);
};

export const getAnswersForLoggedInUserForSpecificQuestion = async (
  questionId
) => {
  const answersCollectionRef = collection(
    db,
    'questions',
    questionId,
    'answers'
  );
  const res = await getDocs(
    query(answersCollectionRef, where('uid', '==', auth.currentUser.uid))
  );
  const answerDocuments = res.docs;
  const answers = answerDocuments.map((answer) => answer.data());
  return deserializeUserInAnswersFromDb(answers);
};

export const getAllAnswersForLoggedInUser = (questions) => {
  const answers = [];
  return questions.map((question) => {
    getAnswersForLoggedInUserForSpecificQuestion(question.documentId).then(
      (answer) => answers.push(answer)
    );
    return answers;
  })[0];
};

export const uploadAnswerToDb = async (
  answer,
  questionId,
  pId = null,
  repliedTo
) => {
  const answersCollectionRef = collection(
    db,
    'questions',
    questionId,
    'answers'
  );
  await addDoc(answersCollectionRef, {
    answer,
    user: serializeDataBeforeSendingToDb(auth.currentUser),
    createdAt: new Date().toString(),
    answerId: uuidV4(),
    pId,
    repliedTo,
    uid: auth.currentUser.uid,
  })
    .then(() => updateNoOfAnswersInDbAfterAnswerUpload(questionId))
    .catch(console.error);
};

export const getQuestionById = async (id) => {
  const questionDocRef = doc(db, 'questions', id);
  const questionDbReference = await getDoc(questionDocRef);
  const questionData = questionDbReference.data();
  return questionData;
};

export const updateNoOfAnswersInDbAfterAnswerUpload = async (questionId) => {
  const questionDocRef = doc(db, 'questions', questionId);
  const question = await getQuestionById(questionId);
  const answersCollectionRef = collection(
    db,
    'questions',
    questionId,
    'answers'
  );
  const answersDatabaseRes = await getDocs(answersCollectionRef);
  const answersSize = answersDatabaseRes.size;
  let noOfAnswers = answersSize;
  if (isAvailable(noOfAnswers)) incrementByOne(noOfAnswers);
  else noOfAnswers = 1;
  await updateDoc(questionDocRef, {
    ...question,
    noOfAnswers,
  }).catch(console.error);
};

export const pluralizeBasedOnValue = (value, word) => {
  if (value === 1) return word;
  else return `${word}s`;
};

export const getRepliesOfAnswerFromDb = async (questionId, answerId) => {
  const answersCollectionRef = collection(
    db,
    'questions',
    questionId,
    'answers'
  );
  const repliesRes = await getDocs(
    query(answersCollectionRef, where('pId', '==', answerId))
  );
  const repliesDocuments = repliesRes.docs;
  const replies = repliesDocuments.map((replyDoc) => {
    return { ...replyDoc.data(), documentId: replyDoc.id };
  });
  return deserializeUserInAnswersFromDb(replies);
};

export const getQuestionsForLoggedInUser = async (uid = null) => {
  const questionsCollectionRef = collection(db, 'questions');
  const res = await getDocs(
    query(
      questionsCollectionRef,
      where('uid', '==', uid || auth?.currentUser?.uid)
    )
  );
  const questionDocuments = res.docs;
  const questions = questionDocuments.map((doc) => {
    return {
      question: doc.data(),
      documentId: doc.id,
    };
  });
  return { questions, noOfQuestions: questions.length };
};

export const toggleDrawer = (event, setIsMenuOpen) => {
  if (
    event &&
    event.type === 'keydown' &&
    (event.key === 'Tab' || event.key === 'Shift')
  ) {
    return;
  }

  setIsMenuOpen((prev) => !prev);
};

export const handleLogout = (navigate, dispatch) => {
  signOut(auth).then(() => {
    dispatch(resetUserState());
    navigate('/');
  });
};

export const getQuestions = async () => {
  const questionsCollectionRef = collection(db, 'questions');
  const res = await getDocs(
    query(questionsCollectionRef, orderBy('createdAt', 'desc'))
  );
  const questionDocuments = res.docs;
  return questionDocuments.map((doc) => {
    return {
      question: doc.data(),
      documentId: doc.id,
    };
  });
};

export const getQuestionsFiltered = async ({ lastKey, LIMIT }) => {
  const questionsCollectionRef = collection(db, 'questions');
  try {
    const res = await getDocs(
      query(
        questionsCollectionRef,
        orderBy('createdAt', 'desc'),
        limit(LIMIT),
        startAfter(lastKey)
      )
    );
    const questionDocuments = res.docs;
    return questionDocuments.map((doc) => {
      return {
        question: doc.data(),
        documentId: doc.id,
      };
    });
  } catch (error) {
    console.log(error);
  }
};

export const sendUserDataToDb = async (userData) => {
  const usersCollectionRef = collection(db, 'users');
  await addDoc(usersCollectionRef, {
    uid: userData.uid,
    user: serializeDataBeforeSendingToDb(userData),
    userCreationTime: new Date().toString(),
  });
};

export const getUserDataById = async (userId) => {
  const usersCollectionRef = collection(db, 'users');
  const usersDbRes = await getDocs(
    query(usersCollectionRef, where('uid', '==', userId))
  );
  const users = usersDbRes.docs;
  if (usersDbRes.size) {
    return users.map((user) => {
      return {
        userData: user.data().user,
        documentId: user.id,
        userCreationTime: user.data().userCreationTime,
      };
    })[0];
  } else {
    return null;
  }
};
