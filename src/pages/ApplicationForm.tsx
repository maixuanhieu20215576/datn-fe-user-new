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
import { useAccessToken } from "../components/common/utils";

export default function ApplicationForm() {
  const token = useAccessToken();

  const user = JSON.parse(localStorage.getItem("user") || "");
  const [fullName, setFullName] = useState<string>(user?.fullName);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [teachingCommitment, setTeachingCommitment] = useState<string>("");
  const [teachingLanguage, setTeachingLanguage] = useState<string[]>([]);
  const [languageSkills, setLanguageSkills] = useState<string>("");
  const [bankAccountNumber, setBankAccountNumber] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [fileError, setFileError] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [CV, setCV] = useState<File>();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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
    { value: "German", text: "Tiếng Đức", select: false },
    { value: "French", text: "Tiếng Pháp", select: false },
    { value: "Italian", text: "Tiếng Ý", select: false },
    { value: "Russian", text: "Tiếng Nga", select: false },
    { value: "Arabic", text: "Tiếng Ả Rập", select: false },
    { value: "Polish", text: "Tiếng Ba Lan", select: false },
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
    formData.append("bankAccountNumber", bankAccountNumber);
    formData.append("bankName", bankName);
    if (CV) {
      formData.append("file", CV);
    }

    try {
      const response =await axios.post(
        `${import.meta.env.VITE_API_URL}/user/apply-teaching`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            userId: user._id,
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );
      if (response.status === 200) {
        setSuccess("Gửi đơn thành công");
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.log(err);
      setError("Lỗi khi gửi đơn, vui lòng thử lại");
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };
  return (
    <div>
      <PageMeta
        title="Đơn đăng ký làm giảng viên"
        description="Đơn đăng ký làm giảng viên"
      />
      <PageBreadcrumb pageTitle="Đơn đăng ký làm giảng viên" />
      {success && <div className="fixed top-5 left-0 right-0 z-1000 mt-12">
        <Alert
          variant="success"
          title="Thành công"
          message="Đơn đăng ký đã được gửi thành công"
        />
      </div>
      }
      {error && (
        <div className="fixed top-5 left-0 right-0 z-1000 mt-12">
          <Alert
            variant="error"
            title="Lỗi"
            message="Đã xảy ra lỗi khi gửi đơn. Vui lòng thử lại"
          />
        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>
                Số tài khoản <span style={{ color: "red" }}>*</span>
              </Label>
              <Input
                type="text"
                placeholder="Số tài khoản"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
              />
            </div>
            <div>
              <Label>
                Tên ngân hàng <span style={{ color: "red" }}>*</span>
              </Label>
              <Input
                type="text"
                placeholder="Tên ngân hàng"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            </div>
          </div>
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
