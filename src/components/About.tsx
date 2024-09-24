import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-red-50">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-red-800 mb-8 text-center">
          Sobre o Morango Express
        </h1>

        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="Morangos frescos"
              className="rounded-lg shadow-md"
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-red-700 mb-4">
              Nossa História
            </h2>
            <p className="text-gray-700 mb-4">
              Fundado em 2020, o Morango Express nasceu da paixão por entregar
              os mais frescos e saborosos morangos diretamente à porta dos
              nossos clientes. Nossa jornada começou em uma pequena fazenda
              familiar e rapidamente cresceu para atender toda a região.
            </p>
            <p className="text-gray-700">
              Hoje, nos orgulhamos de ser a principal escolha para quem busca
              qualidade, frescor e conveniência na entrega de morangos.
            </p>
          </div>
        </div>

        <Card className="mb-12">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-red-700 mb-4">
              Nossa Missão
            </h2>
            <p className="text-gray-700">
              Proporcionar a melhor experiência em delivery de morangos,
              garantindo frescor, qualidade e satisfação em cada entrega.
              Buscamos conectar produtores locais aos amantes de morangos,
              promovendo uma alimentação saudável e apoiando a agricultura
              sustentável.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-red-700 mb-2">
                Qualidade
              </h3>
              <p className="text-gray-700">
                Selecionamos cuidadosamente cada morango para garantir o mais
                alto padrão de qualidade em todas as nossas entregas.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-red-700 mb-2">
                Sustentabilidade
              </h3>
              <p className="text-gray-700">
                Trabalhamos com práticas agrícolas sustentáveis e embalagens
                eco-friendly para minimizar nosso impacto ambiental.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-red-700 mb-2">
                Comunidade
              </h3>
              <p className="text-gray-700">
                Apoiamos produtores locais e nos envolvemos em iniciativas
                comunitárias para fortalecer a economia local.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-700 mb-4">
            Junte-se a nós nessa jornada deliciosa!
          </h2>
          <Button className="bg-green-500 hover:bg-green-600 text-white">
            Faça seu pedido agora
          </Button>
        </div>
      </main>
    </div>
  );
};
