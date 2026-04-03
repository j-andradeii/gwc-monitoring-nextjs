export const QUERY_KEYS = {
  // Members
  members: (params?: Record<string, unknown>) =>
    params ? ['members', params] : ['members'],
  member: (id: string) => ['members', id],

  // Churches
  churches: () => ['churches'],
  church: (id: string) => ['churches', id],

  // Church Campus
  churchCampus: (id: string) => ['church-campus', id],
  churchCampusStaffs: (id: string) => ['church-campus', id, 'staffs'],

  // Campaigns
  campaigns: () => ['campaigns'],
  campaign: (id: string) => ['campaigns', id],

  // Auth
  self: () => ['self'],
} as const;
