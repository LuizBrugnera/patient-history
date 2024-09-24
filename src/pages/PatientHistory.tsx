import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Plus,
  Menu,
  MessageSquare,
  Settings,
  Trash2,
} from "lucide-react";

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  Timestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/firebaseConfig";
import ListPatients from "@/components/PatientList";
import PasswordPrompt from "@/components/PasswordPrompt";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

type Patient = {
  id: string;
  name: string;
  age: number;
  condition: string;
};

type Treatment = {
  id: string;
  patientId: string;
  date: string;
  description: string;
};

type Feedback = {
  id: string;
  patientId: string;
  date: Timestamp;
  content: string;
};

export default function HistoryPatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientSelected, setPatientSelected] = useState<Patient | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const [newTreatmentDate, setNewTreatmentDate] = useState("");
  const [newTreatmentDescription, setNewTreatmentDescription] = useState("");
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newCondition, setNewCondition] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [newFeedback, setNewFeedback] = useState("");
  const [password, setPassword] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  function formatDate(dateString: string): string {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    const storedPassword = localStorage.getItem("userPassword");
    if (storedPassword) {
      setPassword(storedPassword);
    }
  }, []);

  useEffect(() => {
    if (password) {
      const unsubscribe = onSnapshot(
        collection(db, `${password}_patients`),
        (snapshot) => {
          const patientsDate: Patient[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Patient, "id">),
          }));
          setPatients(patientsDate);
        }
      );

      return () => unsubscribe();
    }
  }, [password]);

  useEffect(() => {
    if (patientSelected) {
      const q = query(
        collection(db, `${password}_treatments`),
        where("patientId", "==", patientSelected.id)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const treatmentsDate: Treatment[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Treatment, "id">),
        }));
        setTreatments(treatmentsDate);
      });
      return () => unsubscribe();
    } else {
      setTreatments([]);
    }
  }, [patientSelected, password]);

  useEffect(() => {
    if (patientSelected) {
      const q = query(
        collection(db, `${password}_feedbacks`),
        where("patientId", "==", patientSelected.id)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const feedbacksDate: Feedback[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Feedback, "id">),
        }));
        setFeedbacks(feedbacksDate);
      });
      return () => unsubscribe();
    } else {
      setFeedbacks([]);
    }
  }, [patientSelected, password]);

  const selectPatient = (patient: Patient) => {
    setPatientSelected(patient);
    setMenuOpen(false);
  };

  const addTreatment = async () => {
    if (
      patientSelected &&
      newTreatmentDate &&
      newTreatmentDescription &&
      password
    ) {
      const newTreatment: Omit<Treatment, "id"> = {
        patientId: patientSelected.id,
        date: newTreatmentDate,
        description: newTreatmentDescription,
      };
      try {
        await addDoc(collection(db, `${password}_treatments`), newTreatment);
        setNewTreatmentDate("");
        setNewTreatmentDescription("");
      } catch (error) {
        console.error("Erro ao add treatment:", error);
      }
    }
  };

  const deletePatient = async () => {
    if (patientSelected && password) {
      try {
        await deleteDoc(doc(db, `${password}_patients`, patientSelected.id));
        setPatientSelected(null);
        setConfirmDeleteOpen(false);
      } catch (error) {
        console.error("Erro ao deletar paciente:", error);
      }
    }
  };

  if (!password) {
    return <PasswordPrompt onPasswordSet={setPassword} />;
  }

  const addPatient = async () => {
    if (newName && newAge && newCondition) {
      const newPatient: Omit<Patient, "id"> = {
        name: newName,
        age: parseInt(newAge),
        condition: newCondition,
      };
      try {
        await addDoc(collection(db, `${password}_patients`), newPatient);
        setNewName("");
        setNewAge("");
        setNewCondition("");
        setModalOpen(false);
      } catch (error) {
        console.error("Erro ao add patient:", error);
      }
    }
  };

  const addFeedback = async () => {
    if (patientSelected && newFeedback) {
      const newFeedbackObj: Omit<Feedback, "id"> = {
        patientId: patientSelected.id,
        date: Timestamp.now(),
        content: newFeedback,
      };
      try {
        await addDoc(collection(db, `${password}_feedbacks`), newFeedbackObj);
        setNewFeedback("");
      } catch (error) {
        console.error("Erro ao add feedback:", error);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <div className="absolute top-4 right-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Senha Atual</DialogTitle>
            </DialogHeader>
            <p className="mt-2 text-sm">Senha atual: {password}</p>
          </DialogContent>
        </Dialog>
      </div>

      <div className="md:w-1/4 bg-white p-6 md:block hidden">
        <ListPatients
          patients={patients}
          selectPatient={selectPatient}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          newName={newName}
          setNewName={setNewName}
          newAge={newAge}
          setNewAge={setNewAge}
          newCondition={newCondition}
          setNewCondition={setNewCondition}
          addPatient={addPatient}
        />
      </div>
      <div className="md:hidden">
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="m-4">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Lista de Pacientes</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <ListPatients
                patients={patients}
                selectPatient={selectPatient}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                newName={newName}
                setNewName={setNewName}
                newAge={newAge}
                setNewAge={setNewAge}
                newCondition={newCondition}
                setNewCondition={setNewCondition}
                addPatient={addPatient}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex-1 p-6 overflow-auto">
        {patientSelected ? (
          <>
            <h2 className="text-2xl font-bold mb-4">
              Histórico de {patientSelected.name}
            </h2>
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback>
                    {patientSelected.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {patientSelected.name}
                  </h3>
                  <p className="text-gray-500">Idade: {patientSelected.age}</p>
                  <p className="text-gray-500">
                    Condição: {patientSelected.condition}
                  </p>
                </div>
              </div>
            </div>
            <Tabs defaultValue="treatments" className="w-full">
              <TabsList>
                <TabsTrigger value="treatments">Tratamentos</TabsTrigger>
                <TabsTrigger value="feedbacks">Feedbacks</TabsTrigger>
              </TabsList>
              <TabsContent value="treatments">
                <h3 className="text-xl font-semibold mb-4">
                  Histórico de Tratamentos
                </h3>
                <ScrollArea className="h-[calc(100vh-500px)] bg-white p-4 rounded-lg shadow mb-6">
                  {treatments.map((treatment) => (
                    <div key={treatment.id} className="mb-4 p-4 border-b">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">
                          {formatDate(treatment.date)}
                        </span>
                      </div>
                      <p>{treatment.description}</p>
                    </div>
                  ))}
                </ScrollArea>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-4">
                    Adicionar Novo Tratamento
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="date">Data</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newTreatmentDate}
                        onChange={(e) => setNewTreatmentDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Input
                        id="description"
                        value={newTreatmentDescription}
                        onChange={(e) =>
                          setNewTreatmentDescription(e.target.value)
                        }
                      />
                    </div>
                    <Button onClick={addTreatment}>
                      <Plus className="w-4 h-4 mr-2" /> Adicionar Tratamento
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="feedbacks">
                <h3 className="text-xl font-semibold mb-4">
                  Feedbacks do Paciente
                </h3>
                <ScrollArea className="h-[calc(100vh-500px)] bg-white p-4 rounded-lg shadow mb-6">
                  {feedbacks.map((feedback) => (
                    <div key={feedback.id} className="mb-4 p-4 border-b">
                      <div className="flex items-center space-x-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">
                          {formatDate(
                            new Date(feedback.date.seconds * 1000)
                              .toISOString()
                              .split("T")[0]
                          )}
                        </span>
                      </div>
                      <p>{feedback.content}</p>
                    </div>
                  ))}
                </ScrollArea>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-4">
                    Adicionar Novo Feedback
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="feedback">Feedback</Label>
                      <Textarea
                        id="feedback"
                        value={newFeedback}
                        onChange={(e) => setNewFeedback(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <Button onClick={addFeedback}>
                      <Plus className="w-4 h-4 mr-2" /> Adicionar Feedback
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <Dialog
                open={confirmDeleteOpen}
                onOpenChange={setConfirmDeleteOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" /> Excluir Paciente
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmar Exclusão</DialogTitle>
                  </DialogHeader>
                  <p>
                    Tem certeza que deseja excluir o paciente{" "}
                    {patientSelected.name}?
                  </p>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setConfirmDeleteOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button variant="destructive" onClick={deletePatient}>
                      Excluir
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-xl text-gray-500">
              Selecione um paciente para ver o histórico
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
