/**
 * Reusable status badge component with soft pill design
 *
 * @param {string} status - Status value
 * @param {Object} colorMap - Optional custom color mapping
 *
 * Default color scheme (can be overridden):
 * - Blue: submitted_proposal, initial_comms
 * - Orange: negotiating
 * - Yellow: to_call, waiting_for_feedback
 * - Purple: submitted_company_profile
 * - Gray: na
 * - Green: on_boarded
 * - Red: declined
 */

const defaultColorMap = {
  // Inquiry statuses
  submitted_proposal: "bg-blue-50 text-blue-700 border-blue-200",
  initial_comms: "bg-blue-50 text-blue-700 border-blue-200",
  negotiating: "bg-orange-50 text-orange-700 border-orange-200",
  to_call: "bg-yellow-50 text-yellow-700 border-yellow-200",
  submitted_company_profile: "bg-purple-50 text-purple-700 border-purple-200",
  na: "bg-gray-50 text-gray-700 border-gray-200",
  waiting_for_feedback: "bg-yellow-50 text-yellow-700 border-yellow-200",
  declined: "bg-red-50 text-red-700 border-red-200",
  on_boarded: "bg-green-50 text-green-700 border-green-200",

  // Lead statuses
  new: "bg-blue-50 text-blue-700 border-blue-200",
  contacted: "bg-purple-50 text-purple-700 border-purple-200",
  proposal_sent: "bg-blue-50 text-blue-700 border-blue-200",
  won: "bg-green-50 text-green-700 border-green-200",
  lost: "bg-red-50 text-red-700 border-red-200",

  // User/Generic statuses
  active: "bg-green-50 text-green-700 border-green-200",
  inactive: "bg-gray-50 text-gray-700 border-gray-200",
  suspended: "bg-red-50 text-red-700 border-red-200",
};

const statusLabels = {
  // Inquiry statuses
  submitted_proposal: "Submitted Proposal",
  initial_comms: "Initial Comms",
  negotiating: "Negotiating",
  to_call: "To Call",
  submitted_company_profile: "Submitted Company Profile",
  na: "N/A",
  waiting_for_feedback: "Waiting for Feedback",
  declined: "Declined",
  on_boarded: "On Boarded",

  // Lead statuses
  new: "New",
  contacted: "Contacted",
  proposal_sent: "Proposal Sent",
  won: "Won",
  lost: "Lost",

  // User/Generic statuses
  active: "Active",
  inactive: "Inactive",
  suspended: "Suspended",
};

export function StatusBadge({ status, colorMap = {} }) {
  const mergedColorMap = { ...defaultColorMap, ...colorMap };
  const colorClass = mergedColorMap[status] || mergedColorMap.initial_comms;
  const label = statusLabels[status] || status;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}
    >
      {label}
    </span>
  );
}
