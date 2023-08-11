import { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { PropTypes } from 'prop-types';
import { Box, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import BiggerAvatar from '../../components/BiggerAvatar';

const FileInput = (props) => {
  const providerData = useSelector((state) => state?.user?.providerData) || {};
  const { photoURL } = providerData[0] || [{}];
  const { name, label = name } = props;
  const { register, unregister, setValue, watch } = useFormContext();
  const files = watch(name);
  const onDrop = useCallback(
    (droppedFiles) => {
      setValue(name, droppedFiles, { shouldValidate: true });
    },
    [setValue, name]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: props.accept,
  });
  useEffect(() => {
    register(name);
    return () => {
      unregister(name);
    };
  }, [register, unregister, name]);
  return (
    <>
      <label className=" " htmlFor={name}>
        {label}
      </label>
      <div
        {...getRootProps()}
        type="file"
        role="button"
        aria-label="File Upload"
        id={name}
      >
        <input {...props} {...getInputProps()} />
        <div className={' ' + (isDragActive ? ' ' : ' ')}>
          <Box mt={'10px'}>
            <Button variant="contained" color="secondary">
              Click here or drop the image here ...
            </Button>
          </Box>

          {files?.length ? (
            <Box mt={'10px'}>
              {files.map((file) => {
                return (
                  <div key={file.name}>
                    <BiggerAvatar
                      src={URL.createObjectURL(file) || photoURL}
                      alt={file.name}
                    />
                  </div>
                );
              })}
            </Box>
          ) : (
            <Box mt={'10px'}>
              <BiggerAvatar src={photoURL} alt={photoURL} />
            </Box>
          )}
        </div>
      </div>
    </>
  );
};

FileInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  accept: PropTypes.string,
};

export default FileInput;
