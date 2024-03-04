import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  GraphQLArgs,
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  graphql,
} from 'graphql';
import { UUIDType } from './types/uuid.js';

const postType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    // author: { type: userType },
    // authorId: { type: GraphQLString },
  },
});

const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: {
      value: 'basic',
    },
    business: {
      value: 'business',
    },
  },
});

const memberType = new GraphQLObjectType({
  name: 'Member',
  fields: {
    id: { type: MemberTypeId },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
    // profiles: { type: new GraphQLList(profileType) },
  },
});

const profileType = new GraphQLObjectType({
  name: 'Profile',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    // user: { type: userType }, // @relation(fields: [userId], references: [id], onDelete: Cascade)
    // userId: { type: GraphQLString }, // @unique
    memberType: { type: memberType }, // @relation(fields: [memberTypeId], references: [id], onDelete: Restrict)
    // memberTypeId: { type: GraphQLString },
  },
});

const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: { type: profileType },
    posts: { type: new GraphQLList(postType) },
    userSubscribedTo: { type: new GraphQLList(userType) }, // @relation("subscriber"),
    subscribedToUser: { type: new GraphQLList(userType) }, // @relation("author")
  }),
});

// const subscribersOnAuthorsType = new GraphQLObjectType({
//   name: 'User',
//   fields: {
//     subscriberId: { type: GraphQLString },
//     authorId: { type: GraphQLString },
//     subscriber: { type: userType },
//     author: { type: userType, extensions: {} },
//   },
// });

// model SubscribersOnAuthors {
//   subscriber   User   @relation("subscriber", fields: [subscriberId], references: [id], onDelete: Cascade)
//   subscriberId String
//   author       User   @relation("author", fields: [authorId], references: [id], onDelete: Cascade)
//   authorId     String

//   @@id([subscriberId, authorId])
// }

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      // const query = new GraphQLObjectType({
      //   name: 'Query',
      //   fields: {
      //     user: {
      //       type: userType,
      //       args: {
      //         name: { type: GraphQLString },
      //         balance: { type: GraphQLFloat },
      //       },
      //       resolve: async (_, args) => {
      //         try {
      //           // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      //           return await prisma.user.create({ data: args });
      //         } catch (error) {
      //           if (error instanceof Error) throw new Error(error.message);
      //         }
      //       },
      //     },
      //   },
      // });

      // const query = new GraphQLObjectType({
      //   name: 'Query',
      //   fields: {
      //     memberTypes: {
      //       type: new GraphQLList(memberType),
      //       resolve: async () => {
      //         try {
      //           return await prisma.memberType.findMany();
      //         } catch (error) {
      //           if (error instanceof Error) throw new Error(error.message);
      //         }
      //       },
      //     },
      //     posts: {
      //       type: new GraphQLList(postType),
      //       resolve: async () => {
      //         try {
      //           return await prisma.post.findMany();
      //         } catch (error) {
      //           if (error instanceof Error) throw new Error(error.message);
      //         }
      //       },
      //     },
      //     users: {
      //       type: new GraphQLList(userType),
      //       resolve: async () => {
      //         try {
      //           return await prisma.user.findMany();
      //         } catch (error) {
      //           if (error instanceof Error) throw new Error(error.message);
      //         }
      //       },
      //     },
      //     profiles: {
      //       type: new GraphQLList(profileType),
      //       resolve: async () => {
      //         try {
      //           return await prisma.profile.findMany();
      //         } catch (error) {
      //           if (error instanceof Error) throw new Error(error.message);
      //         }
      //       },
      //     },
      //   },
      // });

      // const query = new GraphQLObjectType({
      //   name: 'Query',
      //   fields: {
      //     memberType: {
      //       type: memberType,
      //       args: {
      //         id: { type: new GraphQLNonNull(MemberTypeId) },
      //       },
      //       resolve: async (_, { id }) => {
      //         try {
      //           return await prisma.memberType.findUnique({
      //             // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      //             where: { id },
      //           });
      //         } catch (error) {
      //           if (error instanceof Error) throw new Error(error.message);
      //         }
      //       },
      //     },
      //     post: {
      //       type: postType,
      //       args: {
      //         id: { type: new GraphQLNonNull(UUIDType) },
      //       },
      //       resolve: async (_, { id }) => {
      //         try {
      //           return await prisma.post.findUnique({
      //             // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      //             where: { id },
      //           });
      //         } catch (error) {
      //           if (error instanceof Error) throw new Error(error.message);
      //         }
      //       },
      //     },
      //     user: {
      //       type: userType,
      //       args: {
      //         id: { type: new GraphQLNonNull(UUIDType) },
      //       },
      //       resolve: async (_, { id }) => {
      //         try {
      //           return await prisma.user.findUnique({
      //             // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      //             where: { id },
      //           });
      //         } catch (error) {
      //           if (error instanceof Error) throw new Error(error.message);
      //         }
      //       },
      //     },
      //     profile: {
      //       type: profileType,
      //       args: {
      //         id: { type: new GraphQLNonNull(UUIDType) },
      //       },
      //       resolve: async (_, { id }) => {
      //         try {
      //           return await prisma.profile.findUnique({
      //             // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      //             where: { id },
      //           });
      //         } catch (error) {
      //           if (error instanceof Error) throw new Error(error.message);
      //         }
      //       },
      //     },
      //   },
      // });

      // const query = new GraphQLObjectType({
      //   name: 'Query',
      //   fields: {
      //     user: {
      //       type: userType,
      //       args: {
      //         id: { type: new GraphQLNonNull(UUIDType) },
      //       },
      //       resolve: async (_, { id }) => {
      //         try {
      //           return await prisma.user.findUnique({
      //             // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      //             where: { id },
      //           });
      //         } catch (error) {
      //           if (error instanceof Error) throw new Error(error.message);
      //         }
      //       },
      //     },
      //     post: {
      //       type: postType,
      //       args: {
      //         id: { type: new GraphQLNonNull(UUIDType) },
      //       },
      //       resolve: async (_, { id }) => {
      //         try {
      //           return await prisma.post.findUnique({
      //             // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      //             where: { id },
      //           });
      //         } catch (error) {
      //           if (error instanceof Error) throw new Error(error.message);
      //         }
      //       },
      //     },
      //     profile: {
      //       type: profileType,
      //       args: {
      //         id: { type: new GraphQLNonNull(UUIDType) },
      //       },
      //       resolve: async (_, { id }) => {
      //         try {
      //           return await prisma.profile.findUnique({
      //             // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      //             where: { id },
      //           });
      //         } catch (error) {
      //           if (error instanceof Error) throw new Error(error.message);
      //         }
      //       },
      //     },
      //     userWithNullProfile: {
      //       type: userType,
      //       args: {
      //         id: { type: new GraphQLNonNull(UUIDType) },
      //       },
      //       resolve: async (_, { id }) => {
      //         try {
      //           return await prisma.user.findUnique({
      //             // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      //             where: { id },
      //             include: {
      //               profile: { select: { id: true } },
      //             },
      //           });
      //         } catch (error) {
      //           if (error instanceof Error) throw new Error(error.message);
      //         }
      //       },
      //     },
      //   },
      // });

      // const query = new GraphQLObjectType({
      //   name: 'Query',
      //   fields: {
      //     user: {
      //       type: userType,
      //       args: {
      //         id: { type: new GraphQLNonNull(UUIDType) },
      //       },
      //       resolve: async (_, { id }) => {
      //         try {
      //           return await prisma.user.findUnique({
      //             // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      //             where: { id },
      //             include: {
      //               profile: {
      //                 select: { id: true, memberType: { select: { id: true } } },
      //               },
      //               posts: { select: { id: true } },
      //             },
      //           });
      //         } catch (error) {
      //           if (error instanceof Error) throw new Error(error.message);
      //         }
      //       },
      //     },
      //     users: {
      //       type: new GraphQLList(userType),
      //       resolve: async () => {
      //         try {
      //           return await prisma.user.findMany({
      //             include: {
      //               profile: {
      //                 select: { id: true, memberType: { select: { id: true } } },
      //               },
      //               posts: { select: { id: true } },
      //             },
      //           });
      //         } catch (error) {
      //           if (error instanceof Error) throw new Error(error.message);
      //         }
      //       },
      //     },
      //   },
      // });

      const query = new GraphQLObjectType({
        name: 'Query',
        fields: {
          user: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            type: userType,
            args: {
              id: { type: new GraphQLNonNull(UUIDType) },
            },
            resolve: async (_, { id }) => {
              try {
                return await prisma.user.findUnique({
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  where: { id },
                  include: {
                    userSubscribedTo: {
                      select: { authorId: true },
                    },
                    subscribedToUser: {
                      select: { subscriberId: true },
                    },
                  },
                });
              } catch (error) {
                if (error instanceof Error) throw new Error(error.message);
              }
            },
          },
        },
      });

      const schema = new GraphQLSchema({ query });

      const data: GraphQLArgs = {
        variableValues: req.body.variables,
        schema,
        source: req.body.query,
      };

      return graphql(data);
    },
  });
};

export default plugin;
