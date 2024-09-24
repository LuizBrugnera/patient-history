import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";

type Patient = {
  id: string;
  name: string;
  age: number;
  condition: string;
};

export default function ListPatients(props: {
  patients: Patient[];
  selectPatient: (patient: Patient) => void;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newName: string;
  setNewName: React.Dispatch<React.SetStateAction<string>>;
  newAge: string;
  setNewAge: React.Dispatch<React.SetStateAction<string>>;
  newCondition: string;
  setNewCondition: React.Dispatch<React.SetStateAction<string>>;
  addPatient: () => void;
}) {
  const {
    patients,
    selectPatient,
    modalOpen,
    setModalOpen,
    newName,
    setNewName,
    newAge,
    setNewAge,
    newCondition,
    setNewCondition,
    addPatient,
  } = props;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Paciente</h2>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" /> Novo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Paciente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  type="number"
                  value={newAge}
                  onChange={(e) => setNewAge(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="condition">Condição</Label>
                <Input
                  id="condition"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                />
              </div>
              <Button onClick={addPatient}>Adicionar Paciente</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="h-[calc(100vh-150px)]">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="flex items-center space-x-4 mb-4 p-2 hover:bg-gray-100 cursor-pointer rounded"
            onClick={() => selectPatient(patient)}
          >
            <Avatar>
              <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{patient.name}</p>
              <p className="text-sm text-gray-500">{patient.condition}</p>
            </div>
          </div>
        ))}
      </ScrollArea>
    </>
  );
}
