import PackageForm from "../components/PackageForm";

export default function NewPackagePage() {
  return (
    <div>
      <h2 className="mb-8 text-3xl font-bold text-white">
        Create Package
      </h2>

      <PackageForm />
    </div>
  );
}