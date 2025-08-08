import { AnimatedSpan, Terminal } from "@/components/magicui/terminal";
import TypeWritter from "@/components/kokonutui/type-writer";

export const TerminalWorkflow = () => {
  return (
    <div className="opacity-30 w-full h-full flex items-center justify-center hover:opacity-100 transition-opacity duration-300">
      <Terminal>
        <TypeWritter
          sequences={[
            { text: "> npx crear-web profesional", deleteAfter: false },
          ]}
          autoLoop={false}
        />

        <AnimatedSpan delay={3500} className="text-green-500">
          <span>✅ Proyecto inicializado correctamente.</span>
        </AnimatedSpan>

        <AnimatedSpan delay={4500} className="text-green-500">
          <span>✅ Paleta y tipografía aplicadas.</span>
        </AnimatedSpan>

        <AnimatedSpan delay={5500} className="text-green-500">
          <span>✅ Componentes y estructura listos.</span>
        </AnimatedSpan>

        <AnimatedSpan delay={6500} className="text-orange-400">
          <span>🔄️ Desplegando desarrollo...</span>
        </AnimatedSpan>

        <AnimatedSpan delay={7000} className="text-orange-400">
          <span>🔄️ Comenzando desarrollo ...</span>
        </AnimatedSpan>

        <TypeWritter
          sequences={[
            {
              text: "ℹ Desarrollo completado. ",
              deleteAfter: false,
            },
          ]}
          autoLoop={false}
          startDelay={8000}
        />

        <TypeWritter
          sequences={[{ text: "Listo para revisión.", deleteAfter: false }]}
          autoLoop={false}
          startDelay={9000}
        ></TypeWritter>
      </Terminal>
    </div>
  );
};
