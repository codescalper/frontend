import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import TiDelete from "@meronex/icons/ti/TiDelete";
import { uploadUserAssets } from "../../../../../../services/apis/BE-apis/backendApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { errorMessage } from "../../../../../../utils/errorMessage";

const UploadFileDropzone = () => {
  const [stFiles, setStFiles] = useState([]);
  const queryClient = useQueryClient();

  // get the base64 string of the file
  const getBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };
      reader.readAsDataURL(file);
    });
  };

  // function for drop/add image to upload
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: async (acceptedFiles) => {
      acceptedFiles.forEach(async (file) => {
        const base64String = await getBase64(file);

        setStFiles((prev) => [
          ...prev,
          Object.assign(file, {
            preview: URL.createObjectURL(file),
            base64String,
          }),
        ]);
      });
    },
  });

  // mutate function for upload image
  const { mutateAsync } = useMutation({
    mutationKey: "uploadUaserAssets",
    mutationFn: uploadUserAssets,
    onSuccess: () => {
      queryClient.invalidateQueries(["userAssets"], { exact: true });
    },
  });

  // function for remove image from dropzone
  const removeFile = (index) => {
    const newFiles = [...stFiles];
    newFiles.splice(index, 1);
    setStFiles(newFiles);
  };

  const thumbs = stFiles.map((file, index) => (
    <div className="" key={file.name}>
      <div className="border border-dashed border-gray-300 p-1 relative">
        <img
          src={file.preview}
          className="block w-auto h-full"
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
        <TiDelete
          className="h-6 w-6 cursor-pointer absolute top-1 right-1"
          color="red"
          onClick={() => removeFile(index)}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    if (stFiles.length > 0) {
      const id = toast.loading("Uploading file...");
      mutateAsync(stFiles[0].base64String)
        .then((res) => {
          if (res?.s3link) {
            toast.update(id, {
              render: "File Uploaded Successfully",
              type: "success",
              isLoading: false,
              autoClose: 3000,
              closeButton: true,
            });
            setStFiles([]);
          } else {
            toast.update(id, {
              render: "Error uploading file",
              type: "error",
              isLoading: false,
              autoClose: 3000,
              closeButton: true,
            });
            setStFiles([]);
          }
        })
        .catch((err) => {
          toast.update(id, {
            render: errorMessage(err),
            type: "error",
            isLoading: false,
            autoClose: 3000,
            closeButton: true,
          });
          setStFiles([]);
        });
    }

    return () => stFiles.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [stFiles]);

  return (
    <>
      <section
        {...getRootProps({ refKey: "innerRef" })}
        className="p-4 outline-none rounded-lg border border-dashed border-blue-500 cursor-pointer"
      >
        <div className="outline-none">
          <input {...getInputProps()} />
          <p>Drag 'n' drop, or Click to browse files</p>
        </div>
      </section>
      <aside className="flex flex-row flex-wrap mt-4">{thumbs}</aside>
    </>
  );
};

export default UploadFileDropzone;
