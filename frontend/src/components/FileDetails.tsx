interface FileDetailsProps {
  file: {
    name: string;
    size: number;
    type: string;
  };
}

export default function FileDetails({ file }: FileDetailsProps) {
  return (
    <div className="border rounded p-4">
      <h2 className="text-lg font-semibold mb-4">File Details</h2>

      <div className="space-y-2">
        <p>
          <strong>Name:</strong> {file.name}
        </p>

        <p>
          <strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB
        </p>

        <p>
          <strong>Type:</strong> {file.type || "Unknown"}
        </p>
      </div>
    </div>
  );
}
