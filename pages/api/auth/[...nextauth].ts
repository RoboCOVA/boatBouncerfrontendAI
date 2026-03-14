import NextAuth, { NextAuthOptions, RequestInternal } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getter, poster } from "@/lib/utils";
import { DefaultSession } from "next-auth";
import { authProviders, ERROR_MESSAGES } from "@/lib/constants";

// nextauth.d.ts
declare module "next-auth" {
  interface User {
    email?: string | string;
    newPassword?: string;
    confirmPassword?: string;
    userName?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phoneNumber?: string;
    id?: string | undefined | null;
    profilePicture?: string | undefined | null;
    token?: string | undefined | null;
    stripeCustomerId?: string | undefined | null;
    stripeAccountId?: string | undefined | null;
    chargesEnabled?: boolean | undefined;
  }

  interface Session extends DefaultSession {
    email?: string | undefined;
    newPassword?: string;
    confirmPassword?: string;
    userName?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phoneNumber?: string;
    id?: string | undefined | null;
    profilePicture?: string | undefined | null;
    token?: string | undefined | null;
    stripeCustomerId?: string | undefined | null;
    stripeAccountId?: string | undefined | null;
    chargesEnabled?: boolean | undefined;
  }
}

// nextauth.d.ts
declare module "next-auth/jwt" {
  interface JWT {
    email?: string;
    newPassword?: string;
    confirmPassword?: string;
    userName?: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    profilePicture?: string | undefined | null;
    phoneNumber?: string;
    id?: string | undefined | null;
    token?: string | undefined | null;
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET as string,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
        id: { label: "password", type: "password" },
        provider: { label: "password", type: "password" },
        encryption: { label: "password", type: "password" },
        PhoneNumber: { label: "password", type: "password" },
        verificationCode: { label: "password", type: "password" },
      },
      authorize: async function (
        credentials: Record<string, string> | undefined,
        req: Pick<RequestInternal, "headers" | "body" | "query" | "method">,
      ) {
        // check user existance
        try {
          if (credentials?.email && credentials?.password) {
            const login = await poster("/user/login", {
              email: credentials.email,
              password: credentials.password,
            });

            if (login._id) {
              return login;
            }

            return null;
          }
          if (
            credentials?.encryption &&
            credentials?.phoneNumber &&
            credentials?.verificationCode
          ) {
            const verifiedSms = await poster("user/otpVerify", {
              phoneNumber: credentials.phoneNumber,
              verificationCode: credentials.verificationCode,
              encryption: credentials.encryption,
            });

            if (verifiedSms._id) {
              return verifiedSms;
            } else {
              return null;
            }
          } else {
            const id = credentials?.id;
            const provider = credentials?.provider;

            if (id && provider && provider === authProviders.GOOGLE) {
              const login = await getter(`auth/${provider}/success/${id}`);

              if (login?.verified) {
                return login;
              } else {
                const error: any = new Error(
                  JSON.stringify({
                    type: ERROR_MESSAGES.USER_NOT_VERIFIED,
                    facebookId: login.googleId,
                  }),
                );
                throw error;
              }
            }

            if (id && provider && provider === authProviders.FACEBOOK) {
              const login = await getter(`auth/${provider}/success/${id}`);

              if (login?._id) {
                if (login?.verified) {
                  return login;
                } else {
                  const error: any = new Error(
                    JSON.stringify({
                      type: ERROR_MESSAGES.USER_NOT_VERIFIED,
                      facebookId: login.facebookId,
                    }),
                  );
                  throw error;
                }
              }

              return null;
            }

            return null;
          }
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
  logger: {
    error(code, metadata) {
      // console.error(code, metadata);
      console.log("next-auth-logger logged an error");
    },
    warn(code) {
      console.warn(code);
    },
    debug(code, metadata) {
      console.debug(code, metadata);
    },
  },
  callbacks: {
    async jwt({ token, session, trigger, user }) {
      if (trigger === "update" && session.profilePicture) {
        token.profilePicture = session.profilePicture;
      }

      if (trigger === "update" && session.firstName) {
        token.firstName = session.firstName;
      }

      if (trigger === "update" && session.lastName) {
        token.lastName = session.lastName;
      }

      if (trigger === "update" && session.phoneNumber) {
        token.phoneNumber = session.phoneNumber;
      }

      if (trigger === "update" && session.email) {
        token.email = session.email;
      }

      return { ...token, ...user };
    },

    async session({ session, token }) {
      return { ...session, ...token };
    },
  },
};

export default NextAuth(authOptions);
