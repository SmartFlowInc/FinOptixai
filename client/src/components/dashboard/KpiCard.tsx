import { IconWrapper } from "@/components/ui/icon-wrapper";

interface KpiCardProps {
  title: string;
  value: string;
  change: number;
  icon: string;
  iconVariant?: "primary" | "secondary" | "accent" | "warning";
  tooltipText?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  icon,
  iconVariant = "primary",
  tooltipText,
}) => {
  const changeClass = change >= 0 ? "text-[#2ECC71]" : "text-[#E74C3C]";
  const changeIcon = change >= 0 ? "ri-arrow-up-line" : "ri-arrow-down-line";

  return (
    <div className="data-card bg-white p-5 rounded-xl shadow-sm">
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-neutral-400">{title}</h3>
          <p className="text-2xl font-semibold text-neutral-500 mt-1 font-mono">{value}</p>
        </div>
        <IconWrapper variant={iconVariant}>
          <i className={`${icon}`}></i>
        </IconWrapper>
      </div>
      <div className="flex items-center">
        <div className={`flex items-center ${changeClass}`}>
          <i className={`${changeIcon} mr-1`}></i>
          <span className="text-sm font-medium">{Math.abs(change)}%</span>
        </div>
        <span className="text-xs text-neutral-400 ml-2">vs previous quarter</span>
      </div>
    </div>
  );
};

export default KpiCard;
