import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Badge from "../../ui/badge/Badge";
import { constants } from "../../../constant";
import axios from "axios";
import moment from "moment";
import Select from "../../form/Select";
import { useAccessToken } from "../../common/utils";

interface ApplicationForm {
  _id: string;
  userId: string;
  fullName: string;
  CV: string;
  languageSkills: string;
  teachingLanguage: string[];
  teachingCommitment:
    | typeof constants.commitment.fulltime
    | typeof constants.commitment.parttime;
  status:
    | typeof constants.applicationStatus.pending
    | typeof constants.applicationStatus.approved
    | typeof constants.applicationStatus.rejected; // "Pending" | "Approved" | "Rejected"
  approvedAt: Date | null;
  createdAt: Date;
}

const fetchApplicationForm = async ({
  filterStatus = constants.applicationStatus.all,
  page = 1,
  itemPerPage = 10,
  userId,
  token,
}: {
  filterStatus?: string;
  page?: number;
  itemPerPage?: number;
  userId: string;
  token: string;
}) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/admin/fetch-application-forms`,
    {
      page,
      itemPerPage,
      filterStatus,
      userId,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export default function ApplicationFormTable() {
  const user = JSON.parse(localStorage.getItem("user") || "");
  const token = useAccessToken();

  const [applicationForms, setApplicationForms] = React.useState<
    ApplicationForm[]
  >([]);
  const [rowsPerPage] = React.useState<number>(10);
  const [page] = React.useState<number>(1);

  const [filteredApplicationForm, setFilteredApplicationForm] = React.useState<
    ApplicationForm[]
  >([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const data = await fetchApplicationForm({
        itemPerPage: rowsPerPage,
        page,
        userId: user?._id,
        token: token, // Pass the token here
      }); // Await API call
      setApplicationForms(data);
      setFilteredApplicationForm(data);
    };

    fetchData();
  }, [rowsPerPage, page]); // Dependency array inside useEffect

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] overflow-auto ">
      <div className="px-5 py-3 mb-4">
        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-xs flex items-center">
            <Select
              options={[
                { value: constants.applicationStatus.all, label: "Tất cả" },
                {
                  value: constants.applicationStatus.pending,
                  label: "Chờ phê duyệt",
                },
                {
                  value: constants.applicationStatus.approved,
                  label: "Chấp nhận",
                },
                {
                  value: constants.applicationStatus.rejected,
                  label: "Từ chối",
                },
              ]}
              placeholder="Lọc theo trạng thái"
              defaultValue={constants.applicationStatus.all}
              onChange={(option) => {
                const filteredForms = applicationForms.filter(
                  (form) =>
                    option === constants.applicationStatus.all ||
                    form.status === option
                );
                setFilteredApplicationForm(filteredForms);
              }}
              className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-white/[0.03] dark:border-white/[0.1] dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto ">
        <div className="min-w-[800px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Họ và tên
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Ngôn ngữ giảng dạy
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Loại hợp đồng
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Ngày nộp đơn
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Trạng thái
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredApplicationForm?.map(
                (applicationForm: ApplicationForm) => (
                  <TableRow key={applicationForm._id}>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {applicationForm.fullName}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {applicationForm.teachingLanguage.join(", ")}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {applicationForm.teachingCommitment}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {moment(applicationForm.createdAt).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Badge
                        size="sm"
                        color={
                          applicationForm.status === "Approved"
                            ? "success"
                            : applicationForm.status === "Pending"
                            ? "warning"
                            : "error"
                        }
                      >
                        {applicationForm.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
