import Input from '../Common/Input';

export default function SearchFilter({ value, onChange }) {
  return (
    <div className="mb-4">
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by code or URL..."
        className="max-w-md bg-white/90 backdrop-blur-sm border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>
  );
}


