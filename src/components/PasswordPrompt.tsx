import { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function PasswordPrompt({
  onPasswordSet,
}: {
  onPasswordSet: (password: string) => void;
}) {
  const [password, setPassword] = useState("");
  const [savedPassword, setSavedPassword] = useState<string | null>(null);

  useEffect(() => {
    const storedPassword = localStorage.getItem("userPassword");
    if (storedPassword) {
      setSavedPassword(storedPassword);
    }
  }, []);

  const handleSubmit = () => {
    if (password) {
      localStorage.setItem("userPassword", password);
      onPasswordSet(password);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Digite uma Senha</h2>
        <Label htmlFor="password">Senha:</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4"
        />
        <Button onClick={handleSubmit}>Salvar Senha</Button>
        {savedPassword && (
          <p className="mt-4 text-sm text-gray-500">
            Senha já salva: {savedPassword}
          </p>
        )}
      </div>
    </div>
  );
}
