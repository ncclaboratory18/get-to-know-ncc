import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Badge, Icon } from "./Visuals";
import { missions, useApp } from "../state";

export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = ref.current!;
    dialog.showModal();
    dialog.querySelector<HTMLElement>("[data-initial-focus]")?.focus();
    return () => {
      dialog.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="modal"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      aria-labelledby="dialog-title"
    >
      <div className="modal-heading">
        <h2 id="dialog-title">{title}</h2>
        <button className="icon-button" onClick={onClose} aria-label="Tutup">
          <Icon name="close" />
        </button>
      </div>
      {children}
    </dialog>
  );
}

export function MissionFrame({
  index,
  children,
  hint,
  onRestart,
  onPause,
}: {
  index: number;
  children: ReactNode;
  hint: ReactNode;
  onRestart: () => void;
  onPause?: (paused: boolean) => void;
}) {
  const mission = missions[index];
  const { visit } = useApp();
  const [help, setHelp] = useState(false);
  useEffect(() => {
    visit(mission.id);
    document.querySelector<HTMLElement>("main h1")?.focus();
  }, [mission.id]);
  function closeHelp() {
    setHelp(false);
    onPause?.(false);
  }
  return (
    <main className="mission-page container">
      <div className="mission-topline">
        <a href="#/misi" className="text-link">
          <Icon name="back" /> Kembali ke Peta
        </a>
        <span className="mono">MISI 0{index + 1} / 03</span>
      </div>
      <div className="mission-heading">
        <div>
          <p className="eyebrow">{mission.category}</p>
          <h1 tabIndex={-1}>{mission.name}</h1>
        </div>
        <div className="mission-tools">
          <button
            className="button secondary"
            onClick={() => {
              setHelp(true);
              onPause?.(true);
            }}
          >
            <Icon name="info" /> Petunjuk
          </button>
          <button className="button secondary" onClick={onRestart}>
            <Icon name="reset" /> Mulai Ulang
          </button>
        </div>
      </div>
      {children}
      <p className="exit-note">
        Percobaan dimulai ulang saat dibuka kembali. Lencana yang diperoleh
        tetap tersimpan.
      </p>
      {help && (
        <Modal title="Petunjuk misi" onClose={closeHelp}>
          <div className="help-content">{hint}</div>
          <button className="button primary" onClick={closeHelp}>
            Mengerti <Icon name="check" />
          </button>
        </Modal>
      )}
    </main>
  );
}

export function Result({
  index,
  children,
}: {
  index: number;
  children?: ReactNode;
}) {
  const { earn } = useApp();
  const ref = useRef<HTMLHeadingElement>(null);
  const mission = missions[index];
  useEffect(() => {
    earn(mission.id);
    ref.current?.focus();
  }, [mission.id]);
  return (
    <section className="result-panel">
      <Badge kind={index} />
      <div className="result-copy">
        <p className="eyebrow">
          <Icon name="check" size={16} /> MISI SELESAI
        </p>
        <h2 ref={ref} tabIndex={-1}>
          {mission.badge}
        </h2>
        {children}
        <p>{mission.concept}</p>
        <h3>Hubungannya dengan NCC?</h3>
        <p>
          {mission.ncc} Permainan ini adalah ilustrasi edukasi untuk mengenalkan
          bidang lab.
        </p>
        <div className="button-row">
          <a className="button primary" href="#/misi">
            Pilih Misi Lain <Icon name="arrow" />
          </a>
          <a className="button secondary" href="#/lencana">
            Lihat Lencana
          </a>
        </div>
      </div>
    </section>
  );
}
