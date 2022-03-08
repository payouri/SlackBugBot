/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
export enum PriorityLevel {
    NORMAL = 'normal',
    HIGH = 'high',
    URGENT = 'urgent',
}

export type Space = {
    id: string;
    name: string;
    private: boolean;
    statuses: (
        | {
              status: 'to do';
              type: 'open';
              orderindex: number;
              color: string;
          }
        | {
              status: 'complete';
              type: 'closed';
              orderindex: number;
              color: string;
          }
    )[];
    multiple_assignees: boolean;
    features: {
        due_dates: {
            enabled: boolean;
            start_date: boolean;
            remap_due_dates: boolean;
            remap_closed_due_date: boolean;
        };
        time_tracking: {
            enabled: boolean;
        };
        tags: {
            enabled: boolean;
        };
        time_estimates: {
            enabled: boolean;
        };
        checklists: {
            enabled: boolean;
        };
        custom_fields: {
            enabled: boolean;
        };
        remap_dependencies: {
            enabled: boolean;
        };
        dependency_warning: {
            enabled: boolean;
        };
        portfolios: {
            enabled: boolean;
        };
    };
};

export type List = {
    id: string;
    name: string;
    orderindex: number;
    content: string;
    deleted: boolean;
    status: {
        status: string;
        color: string;
        hide_label: boolean;
    } | null;
    priority: {
        priority: PriorityLevel;
        color: string;
    } | null;
    assignee: null;
    task_count: number | null;
    due_date: string;
    due_date_time?: boolean;
    start_date: string | null;
    start_date_time?: string;
    folder: Pick<Folder, 'id' | 'name' | 'hidden'> & {
        access: boolean;
    };
    space: Pick<Space, 'id' | 'name'> & {
        access: boolean;
    };
    inbound_address: string;
    archived: boolean;
    override_statuses: boolean;
    statuses: ({
        id: string;
        orderindex: number;
        color: string;
    } & (
        | {
              type: 'open';
              status: 'backlog';
          }
        | {
              type: 'custom';
              status: 'pending';
          }
        | {
              type: 'custom';
              status: 'test failed';
          }
        | {
              type: 'custom';
              status: 'in progress';
          }
        | {
              type: 'custom';
              status: 'to review';
          }
        | {
              type: 'custom';
              status: 'commented';
          }
        | {
              type: 'custom';
              status: 'approved';
          }
        | {
              type: 'custom';
              status: 'to test';
          }
        | {
              type: 'custom';
              status: 'to validate';
          }
        | {
              type: 'custom';
              status: 'validated';
          }
        | {
              type: 'custom';
              status: 'to release';
          }
        | {
              type: 'custom';
              status: 'stand by';
          }
        | {
              type: 'done';
              status: 'released';
          }
        | {
              type: 'done';
              status: 'done';
          }
        | {
              type: 'done';
              status: 'fixed';
          }
        | {
              type: 'closed';
              status: 'Closed';
          }
    ))[];
    permission_level: string;
};

export type Folder = {
    id: string;
    name: string;
    orderindex: number;
    override_statuses: boolean;
    hidden: boolean;
    space: Pick<Space, 'id' | 'name'> & {
        access: boolean;
    };
    task_count: string;
    lists: List[];
};

export type Task = {
    id: string;
    custom_id: string | null;
    name: string;
    text_content: string;
    description: string;
    status: {
        status: string;
        color: string;
        orderindex: number;
        type: string;
    };
    orderindex: string;
    date_created: string;
    date_updated: string;
    date_closed: null;
    creator: {
        id: number;
        username: string;
        color: string;
        profilePicture: string | null;
    };
    assignees: {
        id: number;
        username: string;
        color: string;
        profilePicture: string | null;
    }[];
    checklists: [];
    tags: Tag[];
    parent: null;
    priority: null;
    due_date: null;
    start_date: null;
    time_estimate: null;
    time_spent: null;
    custom_fields: [
        {
            id: string;
            name: string;
            type: string;
            type_config: unknown;
            date_created: string;
            hide_from_guests: false;
            value: string;
            required: true;
        },
        {
            id: string;
            name: string;
            type: string;
            type_config: unknown;
            date_created: string;
            hide_from_guests: false;
            value: string;
            required: false;
        },
        {
            id: string;
            name: string;
            type: string;
            type_config: {
                single_user: true;
                include_groups: true;
                include_guests: true;
                include_team_members: true;
            };
            date_created: string;
            hide_from_guests: false;
            value: {
                id: number;
                username: string;
                email: string;
                color: string;
                initials: string;
                profilePicture: string | null;
            };
            required: false;
        }
    ];
    list: {
        id: string;
    };
    folder: {
        id: string;
    };
    space: {
        id: string;
    };
    url: string;
};

export type Tag = {
    name: string;
    tag_fg: string;
    tag_bg: string;
};
