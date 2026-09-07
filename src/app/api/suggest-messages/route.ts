import OpenAI from "openai";
import {OpenAIStream, StreamingTextResponse} from 'ai'
import { authOption } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";