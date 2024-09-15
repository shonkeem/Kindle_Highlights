import { FileUpload } from "primereact/fileupload";

const Dashboard = () => {
  const onUpload = (event) => {
    console.log("Files uploaded:", event.files);
  };

  return (
    <div>
      <h1>
        This is the dashboard where you will be able to see all of your kindle
        highlights
      </h1>

      <div>
        <h1>Upload File</h1>
        <FileUpload
          name="file"
          url="http://localhost:5000/upload" //Backend URL
          accept="*/*"
          maxFileSize={1000000}
          customUpload
          auto
          chooseLabel="Choose File"
          uploadLabel="Upload"
          cancelLabel="Cancel"
          uploadHandler={(e) => {
            const formData = new FormData();
            formData.append("file", e.files[0]); //Append file to form data

            fetch("http://localhost:5000/upload", {
              method: "POST",
              body: formData,
            })
              .then((response) => response.json())
              .then((data) => {
                console.log("File upload successful", data);
              })
              .catch((eror) => {
                console.error("Error uploading file", error);
              });
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
