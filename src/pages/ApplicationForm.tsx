import { useState } from "react";
import ComponentCard from "../components/common/ComponentCard";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import Input from "../components/form/input/InputField";
import Label from "../components/form/Label";
import Flatpickr from "react-flatpickr";
import { CalenderIcon, PaperPlaneIcon } from "../icons";
import Select from "../components/form/Select";
import MultiSelect from "../components/form/MultiSelect";
import TextArea from "../components/form/input/TextArea";
import FileInput from "../components/form/input/FileInput";
import Button from "../components/ui/button/Button";
import Checkbox from "../components/form/input/Checkbox";
import axios from "axios";
import Alert from "../components/ui/alert/Alert";

export default function ApplicationForm() {
  const user = JSON.parse(localStorage.getItem("user") || "");
  const [fullName, setFullName] = useState<string>(user?.fullName);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [teachingCommitment, setTeachingCommitment] = useState<string>("");
  const [teachingLanguage, setTeachingLanguage] = useState<string[]>([]);
  const [languageSkills, setLanguageSkills] = useState<string>("");
  const [fileError, setFileError] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [CV, setCV] = useState<File>();
  const [error, setError] = useState<string>("");

  const handleDateChange = (date: Date[]) => {
    setDateOfBirth(date[0].toLocaleDateString()); // Handle selected date and format it
  };

  const validateFile = (file: File) => {
    const allowedExtensions = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSizeInMB = 5;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return allowedExtensions.includes(file.type) && file.size <= maxSizeInBytes;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && validateFile(file)) {
      setFileError(false);
      setCV(file);
    } else setFileError(true);
  };

  const commitmentOptions = [
    { value: "Part-time", label: "Part-time" },
    { value: "Full-time", label: "Full-time" },
  ];
  const multiTeachingLanguageOptions = [
    { value: "English", text: "Tiếng Anh", select: false },
    { value: "Japanese", text: "Tiếng Nhật", select: false },
    { value: "Chinese", text: "Tiếng Trung", select: false },
    { value: "Korean", text: "Tiếng Hàn", select: false },
    { value: "Thai", text: "Tiếng Thái", select: false },
    { value: "Spanish", text: "Tiếng Tây Ban Nha", select: false },
  ];
  const handleCommitmentSelectChange = (value: string) => {
    setTeachingCommitment(value);
  };

  const handleSendApplication = async () => {
    const formData = new FormData();
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("fullName", fullName);
    formData.append("teachingCommitment", teachingCommitment);
    formData.append("teachingLanguage", teachingLanguage.join(","));
    formData.append("languageSkills", languageSkills);
    if (CV) {
      formData.append("file", CV);
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/user/apply-teaching`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            userId: user._id,
          },
          timeout: 5000,
        }
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.log(err);
      setError("Lỗi khi gửi đơn, vui lòng thử lại");
    }
  };
  return (
    <div>
      <PageMeta
        title="React.js Form Elements Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Form Elements  Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Đăng ký làm giảng viên" />
      {error && (
        <Alert
          variant="error"
          title="Error"
          message="There was an error submitting your application. Please try again."
        />
      )}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <ComponentCard title="Đơn đăng ký">
          <div>
            <Label htmlFor="inputTwo">
              Họ và tên <span style={{ color: "red" }}>*</span>
            </Label>
            <Input
              type="text"
              id="inputTwo"
              placeholder=""
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="datePicker">
              Ngày sinh <span style={{ color: "red" }}>*</span>
            </Label>
            <div className="relative w-full flatpickr-wrapper">
              <Flatpickr
                value={dateOfBirth} // Set the value to the state
                onChange={handleDateChange} // Handle the date change
                options={{
                  dateFormat: "d-m-Y", // Set the date format
                }}
                placeholder="Chọn"
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <CalenderIcon className="size-6" />
              </span>
            </div>
          </div>
          <div>
            <Label>
              Loại hợp đồng <span style={{ color: "red" }}>*</span>
            </Label>
            <Select
              options={commitmentOptions}
              placeholder="Part-time/Full-time"
              onChange={handleCommitmentSelectChange}
              className="dark:bg-dark-900"
            />
          </div>
          <div>
            <MultiSelect
              label="Ngôn ngữ giảng dạy"
              options={multiTeachingLanguageOptions}
              onChange={(values) => setTeachingLanguage(values)}
              placeholder="Chọn một hoặc nhiều ngôn ngữ"
            />
            <p className="sr-only">
              Selected Values: {teachingLanguage.join(", ")}
            </p>
          </div>

          <div>
            <Label>
              Kỹ năng ngoại ngữ <span style={{ color: "red" }}>*</span>
            </Label>
            <TextArea
              value={languageSkills}
              onChange={(value) => setLanguageSkills(value)}
              rows={6}
              placeholder="Liệt kê các kỹ năng, chứng chỉ của bạn"
            />
          </div>
          <div>
            <Label>
              Upload CV <span style={{ color: "red" }}>*</span>
            </Label>
            <FileInput onChange={handleFileChange} className="custom-class" />
          </div>
          {fileError && (
            <p className="text-red-500 text-sm mt-2">
              File không hợp lệ. Vui lòng tải lên tệp PDF hoặc Word có kích
              thước tối đa 5MB.
            </p>
          )}
          <div className="flex items-center gap-3">
            <Checkbox
              className="w-5 h-5"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
            />
            <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
              Tôi cam đoan những thông tin và chứng chỉ bên trên là chính xác và
              minh bạch.
            </p>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button
              size="sm"
              endIcon={<PaperPlaneIcon />}
              onClick={handleSendApplication}
              disabled={
                !fullName ||
                !dateOfBirth ||
                !teachingCommitment ||
                !teachingLanguage.length ||
                !languageSkills ||
                !isChecked
              }
            >
              {" "}
              Gửi
            </Button>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
