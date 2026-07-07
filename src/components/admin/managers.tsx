"use client";

import EntityManager, { type Column } from "./EntityManager";
import { money } from "@/lib/format";

type Row = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const CROPS = ["Wine grapes", "Almonds", "Lettuce", "Tomatoes", "Strawberries", "Corn", "Cannabis", "Citrus"];
const PRODUCT_LINES = ["Restore", "Cleanse", "Strength", "Grow", "Protect", "Prevent", "Boost"];
const APP_METHODS = ["Foliar Spray", "Drip / Fertigation", "Soil Drench", "Seed Treatment"];
const STATUSES = ["Active", "Inactive"];

const pill = (text: string, active = true) => (
  <span
    className="inline-block rounded-full px-3 py-[5px] text-xs font-bold"
    style={active ? { color: "#356A26", background: "#E9F0E0" } : { color: "#B23A1E", background: "#F8E3DC" }}
  >
    {text}
  </span>
);
const statusCol: Column = { key: "status", label: "Status", render: (r) => pill(r.status || "Active", (r.status || "Active") === "Active") };

export function ClientsManager({ initial }: { initial: Row[] }) {
  return (
    <EntityManager
      entity="clients" initial={initial} addLabel="Add New Client"
      searchKeys={["company", "clientName", "email", "address"]}
      columns={[
        { key: "company", label: "Company" },
        { key: "dateCreated", label: "Date Created" },
        { key: "email", label: "Email" },
        { key: "clientName", label: "Client Name" },
        { key: "address", label: "Address" },
      ]}
      fields={[
        { key: "company", label: "Company", required: true, maxLength: 120 },
        { key: "clientName", label: "Client Name", required: true, maxLength: 80 },
        { key: "email", label: "Email", required: true, maxLength: 320, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, patternMsg: "Enter a valid email address" },
        { key: "address", label: "Address", type: "textarea", maxLength: 500 },
      ]}
      emptyText="No clients found."
    />
  );
}

export function FormulasManager({ initial }: { initial: Row[] }) {
  return (
    <EntityManager
      entity="formulas" initial={initial} addLabel="Add New Formula"
      searchKeys={["name", "crop", "productLine"]}
      filters={[
        { key: "crop", label: "Crop", options: CROPS },
        { key: "productLine", label: "Product Line", options: PRODUCT_LINES },
      ]}
      columns={[
        { key: "name", label: "Name" },
        { key: "productLine", label: "Product Line" },
        { key: "crop", label: "Crop" },
        { key: "dosage", label: "Dosage" },
        { key: "unitPrice", label: "Unit Price", mono: true, render: (r) => money(Number(r.unitPrice || 0)) },
        statusCol,
      ]}
      fields={[
        { key: "name", label: "Formula Name", full: true, required: true, maxLength: 120 },
        { key: "productLine", label: "Product Line", type: "select", options: PRODUCT_LINES, required: true },
        { key: "crop", label: "Crop", type: "select", options: CROPS, required: true },
        { key: "description", label: "Description", type: "textarea", placeholder: "Describe when this formula should be used", maxLength: 2000 },
        { key: "targetPests", label: "Target Pests", placeholder: "Aphids, Whitefly", maxLength: 500 },
        { key: "targetDiseases", label: "Target Diseases", placeholder: "Powdery Mildew, Rust", maxLength: 500 },
        { key: "applicationMethod", label: "Application Method", type: "select", options: APP_METHODS },
        { key: "dosage", label: "Dosage / Acre", placeholder: "1 gallon per 25 acres", maxLength: 120 },
        { key: "unitPrice", label: "Unit Price", type: "number", placeholder: "0.00", required: true, min: 0, max: 99999 },
        { key: "remedies", label: "Remedies", placeholder: "Linked remedies", maxLength: 500 },
        { key: "status", label: "Status", type: "select", options: STATUSES },
      ]}
      emptyText="No formulas found."
    />
  );
}

export function RemediesManager({ initial }: { initial: Row[] }) {
  return (
    <EntityManager
      entity="remedies" initial={initial} addLabel="Add New Remedy" recurringToggle
      searchKeys={["name", "description"]}
      columns={[
        { key: "name", label: "Name" },
        { key: "dateCreated", label: "Date Created" },
        { key: "recurring", label: "Recurring", mono: true, render: (r) => String(r.recurring ?? 0) },
        { key: "description", label: "Description" },
      ]}
      fields={[
        { key: "name", label: "Name", required: true, maxLength: 120 },
        { key: "recurring", label: "Recurring", type: "switch" },
        { key: "description", label: "Description", type: "textarea", maxLength: 2000 },
        { key: "status", label: "Status", type: "select", options: STATUSES },
      ]}
      emptyText="No remedies found."
    />
  );
}

export function AdminsManager({ initial }: { initial: Row[] }) {
  return (
    <EntityManager
      entity="admins" initial={initial} addLabel="Add New Admin"
      searchKeys={["name", "email"]}
      columns={[
        { key: "name", label: "Admin Name" },
        { key: "email", label: "Email" },
        statusCol,
        { key: "dateCreated", label: "Date Created" },
      ]}
      fields={[
        { key: "name", label: "Admin Name", required: true, maxLength: 80 },
        { key: "email", label: "Email", required: true, maxLength: 320, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, patternMsg: "Enter a valid email address" },
        { key: "status", label: "Status", type: "select", options: STATUSES },
      ]}
      emptyText="No admins found."
    />
  );
}

export function TeamManager({ initial }: { initial: Row[] }) {
  return (
    <EntityManager
      entity="team" initial={initial} addLabel="Add New Member" view="cards"
      searchKeys={["name", "role"]}
      fields={[
        { key: "name", label: "Name", required: true, maxLength: 80 },
        { key: "role", label: "Role", required: true, maxLength: 80 },
        { key: "status", label: "Status", type: "select", options: STATUSES },
        { key: "sort", label: "Order", type: "number", min: 0, max: 999 },
      ]}
      renderCard={(m) => (
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-[88px] w-[88px] items-center justify-center rounded-full border-2 border-[#E2DFD2] bg-[#F4F1E8] font-display text-2xl font-extrabold text-leaf-700">
            {String(m.name || "?").split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
          </div>
          <div className="font-display text-[17px] font-extrabold text-forest">{m.name}</div>
          <div className="mt-0.5 text-[13px] text-fg2">{m.role}</div>
          <div className="mt-2 text-xs text-fg3">Order {m.sort} · {m.status}</div>
        </div>
      )}
      emptyText="No team members found."
    />
  );
}

export function ProvenManager({ initial }: { initial: Row[] }) {
  return (
    <EntityManager
      entity="proven" initial={initial} addLabel="Add New Entry" view="cards"
      searchKeys={["title", "linkedOrder"]}
      fields={[
        { key: "title", label: "Title", full: true, required: true, maxLength: 180 },
        { key: "metric1Label", label: "Metric 1 Label", placeholder: "Yield", maxLength: 60 },
        { key: "metric1Value", label: "Metric 1 Value", placeholder: "+38%", maxLength: 30 },
        { key: "metric2Label", label: "Metric 2 Label", placeholder: "Pest Loss", maxLength: 60 },
        { key: "metric2Value", label: "Metric 2 Value", placeholder: "-70%", maxLength: 30 },
        { key: "linkedOrder", label: "Linked Order", placeholder: "Order 1", maxLength: 80 },
        { key: "status", label: "Status", type: "select", options: STATUSES },
        { key: "description", label: "Description", type: "textarea", maxLength: 2000 },
      ]}
      renderCard={(e) => (
        <div>
          <div className="mb-4 h-[90px] rounded-xl bg-[radial-gradient(circle_at_50%_30%,#E8F2DE_0%,#F4F1E8_80%)]" />
          <div className="font-display text-[17px] font-extrabold text-forest">{e.title}</div>
          <div className="mt-2.5 flex gap-2.5">
            <span className="text-[13px]"><strong className="text-leaf-700">{e.metric1Value}</strong> <span className="text-fg3">{e.metric1Label}</span></span>
            <span className="text-[13px]"><strong className="text-[#B23A1E]">{e.metric2Value}</strong> <span className="text-fg3">{e.metric2Label}</span></span>
          </div>
          <div className="mt-3 text-xs text-fg3">{e.linkedOrder} · {e.status}</div>
        </div>
      )}
      emptyText="No entries found."
    />
  );
}

export function FaqsManager({ initial }: { initial: Row[] }) {
  return (
    <EntityManager
      entity="faqs" initial={initial} addLabel="Add New FAQ"
      searchKeys={["section"]}
      columns={[
        { key: "section", label: "Section" },
        { key: "product", label: "Product" },
        statusCol,
        { key: "questions", label: "Questions", render: (r) => String((r.questions ?? []).length) },
      ]}
      fields={[
        { key: "section", label: "Section", required: true, maxLength: 120 },
        { key: "product", label: "Product", type: "select", options: ["No", "Yes"] },
        { key: "status", label: "Status", type: "select", options: STATUSES },
        { key: "questions", label: "Questions", type: "qa" },
      ]}
      emptyText="No FAQs found."
    />
  );
}
