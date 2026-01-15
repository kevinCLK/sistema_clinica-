import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import prisma from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email as string
                    }
                })

                if (!user) {
                    return null
                }

                const isPasswordValid = await compare(
                    credentials.password as string,
                    user.password
                )

                if (!isPasswordValid) {
                    return null
                }

                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: user.name,
                    // @ts-ignore
                    image: user.image,
                }
            }
        })
    ],
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id
                token.picture = user.image
            }
            if (trigger === "update" && session?.user?.image) {
                token.picture = session.user.image
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.image = token.picture
            }
            return session
        }
    }
})
