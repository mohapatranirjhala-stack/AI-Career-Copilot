
type Props = {
  title: string;
  value: string | number;
  icon: string;
};

export default function StatsCard({
  title,
  value,
  icon,
}: Props) {
  return (
    <div className="bg-white rounded-xl p-5 shadow border hover:shadow-lg transition">

      <div className="flex justify-between items-center">

        <p className="text-gray-500">
          {title}
        </p>

        <span className="text-2xl">
          {icon}
        </span>

      </div>

      <h2 className="text-3xl font-bold mt-3">
        {value}
      </h2>

    </div>
  );
}