Backend/
├── src/
│   ├── index.ts
│
│   ├── config/
│   │   ├── db.ts
│   │   ├── env.ts
│   │   └── plugins.ts
│
│   ├── shared/
│   │   ├── errors/
│   │   │   ├── NotFoundError.ts
│   │   │   ├── UnauthorizedError.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── hashPassword.ts
│   │   │   ├── generateId.ts
│   │   │   └── formatDate.ts
│   │   │
│   │   └── types/
│   │       ├── user.types.ts
│   │       ├── post.types.ts
│   │       ├── message.types.ts
│   │       └── index.ts
│
│   ├── database/
│   │   ├── index.ts
│   │   ├── models/
│   │   └── migrations/
│
│   ├── modules/
│   │
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.repo.ts
│   │   │   └── auth.types.ts
│   │
│   │   ├── users/
│   │   │   ├── users.routes.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.repo.ts
│   │   │   └── users.types.ts
│   │
│   │   ├── posts/
│   │   │   ├── posts.routes.ts
│   │   │   ├── posts.controller.ts
│   │   │   ├── posts.service.ts
│   │   │   ├── posts.repo.ts
│   │   │   └── posts.types.ts
│   │
│   │   ├── feed/
│   │   │   ├── feed.routes.ts
│   │   │   ├── feed.service.ts
│   │   │   └── feed.controller.ts
│   │
│   │   ├── chat/
│   │   │   ├── chat.routes.ts
│   │   │   ├── chat.gateway.ts
│   │   │   ├── chat.service.ts
│   │   │   ├── chat.repo.ts
│   │   │   └── chat.types.ts
│   │
│   │   └── video-chat/
│   │       ├── signaling.gateway.ts
│   │       ├── room.manager.ts
│   │       ├── video.service.ts
│   │       └── video.types.ts
│
├── package.json
├── tsconfig.json
└── bun.lock