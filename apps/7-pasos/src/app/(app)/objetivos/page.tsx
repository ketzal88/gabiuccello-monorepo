"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useObjectives } from "@/hooks/use-objectives";
import { updateOnboardingPhase } from "@/lib/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { OBJECTIVE_CATEGORIES, cn } from "@/lib/utils";
import {
  Plus,
  Target,
  Edit3,
  Trash2,
  CheckCircle2,
  Circle,
  Volume2,
  Lightbulb,
  Flame,
  ArrowRight,
  Sparkles,
  BookOpen,
} from "lucide-react";

export default function ObjetivosPage() {
  const { user, profile, refreshProfile } = useAuth();
  const { objectives, loading, addObjective, updateObjective, deleteObjective } = useObjectives();
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [showReadMode, setShowReadMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formText, setFormText] = useState("");
  const [formCategory, setFormCategory] = useState<"personal" | "profesional" | "relaciones" | "financiero">("personal");
  const [submitting, setSubmitting] = useState(false);

  const phase = profile?.onboardingPhase || "reading";
  const activeObjectives = objectives.filter((o) => o.status === "active");
  const completedObjectives = objectives.filter((o) => o.status === "completed");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formText.trim()) return;
    setSubmitting(true);
    await addObjective({
      text: formText.trim(),
      category: formCategory,
      order: objectives.length + 1,
    });
    setFormText("");
    setFormCategory("personal");
    setShowAdd(false);
    setSubmitting(false);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !formText.trim()) return;
    setSubmitting(true);
    await updateObjective(editingId, { text: formText.trim(), category: formCategory });
    setEditingId(null);
    setFormText("");
    setSubmitting(false);
  };

  const handleToggleComplete = async (id: string, currentStatus: string) => {
    await updateObjective(id, {
      status: currentStatus === "active" ? "completed" : "active",
    });
  };

  const startEdit = (obj: typeof objectives[0]) => {
    setEditingId(obj.id!);
    setFormText(obj.text);
    setFormCategory(obj.category);
  };

  const handleActivateTracker = async () => {
    if (!user) return;
    await updateOnboardingPhase(user.uid, "tracking");
    await refreshProfile();
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-victoria-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-stone-900">
            Tus 10 Objetivos
          </h1>
          <p className="text-stone-500 mt-1">
            Escritos en presente, para 180 días
          </p>
        </div>
        <div className="flex gap-2">
          {objectives.length > 0 && (
            <Button variant="secondary" onClick={() => setShowReadMode(true)}>
              <Volume2 size={16} />
              <span className="hidden sm:inline">Leer en voz alta</span>
            </Button>
          )}
          {objectives.length < 10 && (
            <Button onClick={() => setShowAdd(true)}>
              <Plus size={16} />
              <span className="hidden sm:inline">Agregar</span>
            </Button>
          )}
        </div>
      </div>

      {/* Phase-specific banners */}
      {phase === "reading" && (
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
          <BookOpen size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-700">
            Podés escribir tus objetivos ahora o después de terminar la lectura de los 7 pasos.
          </p>
        </div>
      )}

      {/* Activate tracker CTA */}
      {activeObjectives.length >= 10 && phase === "objectives" && (
        <Card className="border-victoria-300 bg-gradient-to-br from-victoria-50 to-victoria-100/50">
          <CardContent className="pt-6 pb-6 text-center">
            <Sparkles size={28} className="text-victoria-500 mx-auto mb-3" />
            <h2 className="text-lg font-display font-bold text-stone-900 mb-2">
              ¡Tus 10 objetivos están listos!
            </h2>
            <p className="text-stone-600 mb-4 text-sm max-w-md mx-auto">
              Ahora activá tu tracker para empezar a sumar victorias diarias durante 180 días.
            </p>
            <Button size="lg" onClick={handleActivateTracker}>
              <Flame size={18} />
              Activar tracker de 180 días
              <ArrowRight size={16} />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tip */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
        <Lightbulb size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-amber-700">
          <strong>Recorda:</strong> escritos en presente (&ldquo;voy al gimnasio 2 veces por
          semana&rdquo;, no &ldquo;quiero ir al gimnasio&rdquo;). Que sean específicos, posibles y
          medibles. Leelos en voz alta cada mañana.
        </div>
      </div>

      {/* Objectives Counter */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-victoria-500" />
          <span className="text-sm font-medium text-stone-600">
            {activeObjectives.length} de 10 objetivos
          </span>
        </div>
        <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-victoria-500 rounded-full transition-all"
            style={{ width: `${(activeObjectives.length / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Active Objectives */}
      {activeObjectives.length > 0 ? (
        <div className="space-y-3">
          {activeObjectives.map((obj, i) => {
            const catInfo = OBJECTIVE_CATEGORIES.find((c) => c.value === obj.category);
            return (
              <Card key={obj.id} className="group">
                <CardContent className="py-4 px-5">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handleToggleComplete(obj.id!, obj.status)}
                      className="mt-1 flex-shrink-0"
                    >
                      <Circle size={20} className="text-stone-300 hover:text-victoria-500 transition-colors" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-stone-400">#{i + 1}</span>
                        {catInfo && (
                          <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", catInfo.color)}>
                            {catInfo.label}
                          </span>
                        )}
                      </div>
                      <p className="text-stone-900 font-medium">{obj.text}</p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        onClick={() => startEdit(obj)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => deleteObjective(obj.id!)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Target size={40} className="text-stone-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-stone-700 mb-2">
              Todavía no tenés objetivos
            </h3>
            <p className="text-stone-500 mb-6 max-w-sm mx-auto">
              Escribí tus 10 objetivos para los próximos 180 días. En presente, específicos y medibles.
            </p>
            <Button onClick={() => setShowAdd(true)}>
              <Plus size={16} />
              Escribir mi primer objetivo
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Completed Objectives */}
      {completedObjectives.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-stone-400 uppercase tracking-wider mb-3">
            Completados
          </h2>
          <div className="space-y-2">
            {completedObjectives.map((obj) => (
              <Card key={obj.id} className="opacity-60">
                <CardContent className="py-3 px-5">
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleToggleComplete(obj.id!, obj.status)}>
                      <CheckCircle2 size={20} className="text-victoria-500" />
                    </button>
                    <p className="text-stone-500 line-through">{obj.text}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        title="Nuevo objetivo"
      >
        <form onSubmit={handleAdd} className="space-y-4 mt-2">
          <Input
            label="Tu objetivo (en presente)"
            placeholder='Ej: "Voy al gimnasio 3 veces por semana"'
            value={formText}
            onChange={(e) => setFormText(e.target.value)}
            required
            autoFocus
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-stone-700">Categoría</label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value as typeof formCategory)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-victoria-500"
            >
              {OBJECTIVE_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowAdd(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={submitting}>
              {submitting ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingId}
        onClose={() => setEditingId(null)}
        title="Editar objetivo"
      >
        <form onSubmit={handleEdit} className="space-y-4 mt-2">
          <Input
            label="Tu objetivo (en presente)"
            value={formText}
            onChange={(e) => setFormText(e.target.value)}
            required
            autoFocus
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-stone-700">Categoría</label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value as typeof formCategory)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-victoria-500"
            >
              {OBJECTIVE_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setEditingId(null)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={submitting}>
              {submitting ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Read Aloud Mode */}
      <Modal
        isOpen={showReadMode}
        onClose={() => setShowReadMode(false)}
        title="Lectura matutina"
        className="max-w-lg"
      >
        <div className="space-y-1 mt-2">
          <p className="text-sm text-stone-500 mb-6">
            Leé cada objetivo en voz alta. Sentí cada palabra.
          </p>
          {activeObjectives.map((obj, i) => (
            <div key={obj.id} className="p-4 bg-stone-50 rounded-xl">
              <span className="text-xs font-bold text-victoria-500 mb-1 block">#{i + 1}</span>
              <p className="text-lg font-medium text-stone-900">{obj.text}</p>
            </div>
          ))}
          <div className="pt-4 mt-4 border-t border-stone-200">
            <p className="text-center text-stone-500 italic font-display">
              &ldquo;Yo amo a mi persona. Que feliz que soy. Me encanta lo que tengo. Yo soy responsable.&rdquo;
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
