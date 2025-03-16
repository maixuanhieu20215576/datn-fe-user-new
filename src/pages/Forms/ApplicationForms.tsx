import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/ApplicationFormTable";

export default function ApplicationForms() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Đơn đăng ký giảng dạy" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
        <ComponentCard title="Danh sách đơn">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
