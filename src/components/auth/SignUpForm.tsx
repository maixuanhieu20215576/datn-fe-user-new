import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import axios from "axios";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [signUpError, setSignUpError] = useState<string>("");
  const [isSignupSuccess, setIsSignupSuccess] = useState<boolean>(false);

  const navigate = useNavigate();

  const validatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPassword(password);

    // Add your password validation logic here
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < 8 || !hasNumber || !hasSymbol) {
      setPasswordError(
        "Mật khẩu phải dài ít nhất 8 ký tự, chứa số và ký tự đặc biệt."
      );
    } else {
      setPasswordError("");
    }
  };

  const [emailError, setEmailError] = useState<string>("");
  console.log(isChecked, emailError, passwordError);
  const validateEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setEmail(email);

    // Add your email validation logic here
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Email không hợp lệ.");
    } else {
      setEmailError("");
    }
  };

  interface SignUpFormData {
    fullName: string;
    email: string;
    username: string;
    password: string;
  }

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const signUpData: SignUpFormData = {
      fullName,
      email,
      username,
      password,
    };
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/verify/register`,
        signUpData
      );
      setIsSignupSuccess(true);
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setSignUpError(error.response.data.message);
      } else {
        setSignUpError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      {isSignupSuccess && (
        <div
          className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md"
          role="alert"
        >
          <div className="flex">
            <div className="py-1">
              <svg
                className="fill-current h-6 w-6 text-teal-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Our privacy policy has changed</p>
              <p className="text-sm">
                Make sure you know how these changes affect you.
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10"></div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Đăng ký{" "}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Bước chân đầu tiên tới với tri thức !{" "}
            </p>
          </div>
          <div>
            <form onSubmit={handleSignUp}>
              <div className="space-y-5">
                {/* <!-- First Name --> */}
                <div className="sm:col-span-1">
                  <Label>
                    Họ và tên<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="fname"
                    name="fname"
                    placeholder="Nhập tên đầy đủ"
                    onChange={(e) => setFullName(e.target.value)}
                    value={fullName}
                  />
                </div>
                {/* <!-- Email --> */}
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Nhập email của bạn"
                    onChange={(e) => validateEmail(e)}
                    value={email}
                  />
                  {emailError && (
                    <div className="mt-2 text-sm text-red-600">
                      {emailError}
                    </div>
                  )}
                </div>
                <div>
                  <Label>
                    Tên đăng nhập<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Tên đăng nhập bạn sẽ sử dụng"
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                  />
                </div>
                {/* <!-- Password --> */}
                <div>
                  <Label>
                    Mật khẩu<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Nhập mật khẩu"
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => validatePassword(e)}
                      value={password}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                  {passwordError && (
                    <div className="mt-2 text-sm text-red-600">
                      {passwordError}
                    </div>
                  )}
                </div>
                {/* <!-- Checkbox --> */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    className="w-5 h-5"
                    checked={isChecked}
                    onChange={setIsChecked}
                  />
                  <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                    Bằng cách tạo tài khoản, bạn đồng ý với{" "}
                    <span className="text-gray-800 dark:text-white/90">
                      Điều khoản và Điều kiện,
                    </span>{" "}
                    và{" "}
                    <span className="text-gray-800 dark:text-white">
                      Chính sách Bảo mật
                    </span>
                  </p>
                </div>
                {signUpError && (
                  <div className="mt-2 text-sm text-red-600">{signUpError}</div>
                )}
                {/* <!-- Button --> */}
                <div>
                  <button
                    className={`flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg shadow-theme-xs ${
                      !(!isChecked || passwordError !== "" || emailError !== "")
                        ? "bg-brand-500 hover:bg-brand-600"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    type="submit"
                    disabled={
                      !isChecked || passwordError !== "" || emailError !== ""
                    }
                  >
                    Đăng ký{" "}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Bạn đã có sẵn tài khoản ? {""}
                <Link
                  to="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
