import Breadcrumb, { type BreadcrumbItem } from "./Breadcrumb";

interface PageHeaderProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
}

export default function PageHeader({ title, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="page-header">
      <h1 className="page-header__title">{title}</h1>
      <Breadcrumb items={breadcrumbs} />
    </div>
  );
}
