export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Alight Motion Pro VIP API',
    version: '1.0.0',
    description:
      'Layanan REST API modern berbasis TypeScript untuk integrasi aktivasi lisensi **Alight Motion Pro VIP 1 Tahun** dan verifikasi Firebase Magic Link.',
    contact: {
      name: 'API Support',
    },
    license: {
      name: 'ISC',
    },
  },
  servers: [
    {
      url: '/',
      description: 'Current Server Environment',
    },
  ],
  tags: [
    {
      name: 'Alight Motion',
      description: 'Endpoint operasi lisensi dan verifikasi Alight Motion',
    },
    {
      name: 'System',
      description: 'Endpoint informasi sistem & health check',
    },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Health Check',
        description: 'Mengecek ketersediaan server API.',
        responses: {
          200: {
            description: 'Server aktif dan berjalan normal.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/HealthResponse',
                },
              },
            },
          },
        },
      },
    },
    '/api/am/send-link': {
      post: {
        tags: ['Alight Motion'],
        summary: 'Kirim Magic Link ke Email',
        description:
          'Meminta Firebase mengirimkan email verifikasi Alight Motion ke email target. Email disimpan di session sementara.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SendLinkRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Link berhasil dikirim ke email.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SendLinkResponse',
                },
              },
            },
          },
          400: {
            description: 'Format email tidak valid atau gagal mengirim link.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          429: {
            description: 'Rate limit tercapai.',
          },
        },
      },
    },
    '/api/am/verify': {
      post: {
        tags: ['Alight Motion'],
        summary: 'Verifikasi Magic Link & Aktivasi Lisensi Pro VIP',
        description:
          'Memverifikasi oobCode dari tautan email dan mengaktifkan lisensi Pro VIP 1 tahun. Email bersifat opsional jika sudah ada sesi dari send-link.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/VerifyRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Hasil verifikasi akun & lisensi.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/VerifyResponse',
                },
              },
            },
          },
          400: {
            description: 'Tautan tidak valid atau kadaluarsa.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse',
                },
              },
            },
          },
          429: {
            description: 'Rate limit tercapai.',
          },
        },
      },
    },
    '/api/am/command': {
      post: {
        tags: ['Alight Motion'],
        summary: 'Bot Command Adapter (WhatsApp / Telegram)',
        description:
          'Menerima format perintah teks bot langsung seperti `!amprem user@gmail.com`, `!amverify <link>`, `!amstats`, atau `!amhelp`.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CommandRequest',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Hasil eksekusi perintah bot.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CommandResponse',
                },
              },
            },
          },
          400: {
            description: 'Perintah salah atau parameter tidak lengkap.',
          },
        },
      },
    },
    '/api/am/stats': {
      get: {
        tags: ['Alight Motion'],
        summary: 'Statistik Aktivasi',
        description: 'Melihat statistik total akun aktif dan aktivasi hari ini.',
        responses: {
          200: {
            description: 'Data statistik aktivasi.',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/StatsResponse',
                },
              },
            },
          },
        },
      },
    },
    '/api/am/help': {
      get: {
        tags: ['Alight Motion'],
        summary: 'Panduan Bantuan & Alur Kerja',
        description: 'Mengambil panduan lengkap penggunaan API dalam format JSON dan teks.',
        responses: {
          200: {
            description: 'Informasi panduan & alur kerja.',
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key',
        description: 'Kunci rahasia API (jika API_SECRET_KEY diaktifkan)',
      },
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        description: 'Token Bearer API (jika API_SECRET_KEY diaktifkan)',
      },
    },
    schemas: {
      HealthResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          status: { type: 'string', example: 'ok' },
          service: { type: 'string', example: 'alight-motion-premium-api' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
      SendLinkRequest: {
        type: 'object',
        required: ['email'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'user@gmail.com',
            description: 'Alamat email target yang akan menerima magic link',
          },
          sessionId: {
            type: 'string',
            example: 'sess_123456',
            description: 'ID sesi opsional untuk mengikat alur verifikasi',
          },
          senderId: {
            type: 'string',
            example: '628123456789@s.whatsapp.net',
            description: 'ID pengirim/bot opsional',
          },
        },
      },
      SendLinkResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Link verifikasi Alight Motion berhasil dikirim...' },
          sessionId: { type: 'string', example: 'am_sess_xxxxxx' },
          formattedText: { type: 'string', example: '*乂 ALIGHT MOTION PRO 乂*\\n\\n• *Status:* Link Terkirim...' },
          data: {
            type: 'object',
            properties: {
              email: { type: 'string', example: 'user@gmail.com' },
              sessionId: { type: 'string', example: 'am_sess_xxxxxx' },
              nextSteps: {
                type: 'array',
                items: { type: 'string' },
              },
            },
          },
        },
      },
      VerifyRequest: {
        type: 'object',
        required: ['link'],
        properties: {
          link: {
            type: 'string',
            example: 'https://alightcreative.com/?link=...&oobCode=xxxx',
            description: 'Tautan dari tombol "Sign in to Alight Motion" di email',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'user@gmail.com',
            description: 'Email (opsional jika sudah session-tracked dari send-link)',
          },
          sessionId: {
            type: 'string',
            example: 'am_sess_xxxxxx',
            description: 'ID sesi dari response send-link',
          },
        },
      },
      VerifyResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          isPremium: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Alight Motion Pro VIP berhasil diaktifkan!' },
          formattedText: { type: 'string', example: '*🎉 ALIGHT MOTION PRO VIP AKTIF 🎉*...' },
          data: {
            type: 'object',
            properties: {
              uid: { type: 'string', example: 'user_local_id' },
              email: { type: 'string', example: 'user@gmail.com' },
              status: { type: 'string', example: 'ACTIVE' },
              tier: { type: 'string', example: 'Alight Motion Pro VIP' },
              subscription: { type: 'string', example: 'Yearly VIP License' },
              orderId: { type: 'string', example: 'neo-abcdef123456' },
              validUntil: { type: 'string', example: '21 Oktober 2027' },
              stats: {
                type: 'object',
                properties: {
                  total: { type: 'number', example: 145 },
                  today: { type: 'number', example: 21 },
                },
              },
            },
          },
        },
      },
      CommandRequest: {
        type: 'object',
        required: ['text'],
        properties: {
          text: {
            type: 'string',
            example: '!amprem user@gmail.com',
            description: 'Teks perintah bot (!amprem, !amverify, !amstats, !amhelp)',
          },
          senderId: {
            type: 'string',
            example: '628123456789@s.whatsapp.net',
            description: 'ID pengirim / JID bot WhatsApp',
          },
        },
      },
      CommandResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          command: { type: 'string', example: 'amprem' },
          replyText: { type: 'string', example: '*乂 ALIGHT MOTION PRO 乂*\\n\\n...' },
          data: { type: 'object' },
        },
      },
      StatsResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Statistik Alight Motion Pro' },
          formattedText: { type: 'string', example: '*乂 STATISTIK ALIGHT MOTION PRO 乂*...' },
          data: {
            type: 'object',
            properties: {
              totalPremium: { type: 'number', example: 145 },
              todayPremium: { type: 'number', example: 21 },
              status: { type: 'string', example: 'Online 🟢' },
            },
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Pesan kesalahan yang ramah' },
          error: { type: 'string', example: 'Detail error opsional' },
        },
      },
    },
  },
};
