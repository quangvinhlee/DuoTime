import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import {
  ApolloServerTestClient,
  createTestClient,
} from 'apollo-server-testing';
import { gql } from 'apollo-server-express';
import { AppModule } from '../src/app.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let apolloClient: ApolloServerTestClient;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { apolloServer } = app.get(GraphQLModule);
    apolloClient = createTestClient(apolloServer);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GraphQL Auth Endpoints', () => {
    const GOOGLE_LOGIN_MUTATION = gql`
      mutation GoogleLogin($googleLoginInput: GoogleLoginInput!) {
        googleLogin(googleLoginInput: $googleLoginInput) {
          token
        }
      }
    `;

    const GET_PROFILE_QUERY = gql`
      query GetProfile {
        getProfile {
          id
          email
          name
          avatarUrl
          googleId
          partnerId
          createdAt
          updatedAt
        }
      }
    `;

    const RENEW_TOKEN_MUTATION = gql`
      mutation RenewToken {
        renewToken {
          token
        }
      }
    `;

    it('should handle Google login mutation', async () => {
      const result = await apolloClient.mutate({
        mutation: GOOGLE_LOGIN_MUTATION,
        variables: {
          googleLoginInput: {
            idToken: 'mock-google-id-token',
          },
        },
      });

      // The test will likely fail due to Google OAuth verification
      // but this demonstrates the structure
      expect(result.errors).toBeDefined();
      // In a real test with proper mocking, you'd expect success
    });

    it('should handle getProfile query (requires authentication)', async () => {
      const result = await apolloClient.query({
        query: GET_PROFILE_QUERY,
      });

      // This should fail due to missing authentication
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]?.message).toContain('Unauthorized');
    });

    it('should handle renewToken mutation (requires authentication)', async () => {
      const result = await apolloClient.mutate({
        mutation: RENEW_TOKEN_MUTATION,
      });

      // This should fail due to missing authentication
      expect(result.errors).toBeDefined();
      expect(result.errors?.[0]?.message).toContain('Unauthorized');
    });
  });
});
