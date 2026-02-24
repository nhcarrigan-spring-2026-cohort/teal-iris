import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  Inject,
} from "@nestjs/common";
import { eq, and, or } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "../../db/schema";
import { DRIZZLE } from "../../db/db.module";
import { connections, users } from "../../db/schema";
import { CreateConnectionDto } from "./dto/create-connection.dto";

@Injectable()
export class ConnectionsService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>) {}

  async create(senderId: string, createConnectionDto: CreateConnectionDto) {
    const { receiverId } = createConnectionDto;

    if (senderId === receiverId) {
      throw new BadRequestException(
        "You cannot send a connection request to yourself",
      );
    }

    // Check if receiver exists
    const receiver = await this.db.query.users.findFirst({
      where: eq(users.id, receiverId),
    });

    if (!receiver) {
      throw new NotFoundException("Receiver user not found");
    }

    // Check if a connection already exists
    const existingConnection = await this.db.query.connections.findFirst({
      where: or(
        and(
          eq(connections.senderId, senderId),
          eq(connections.receiverId, receiverId),
        ),
        and(
          eq(connections.senderId, receiverId),
          eq(connections.receiverId, senderId),
        ),
      ),
    });

    if (existingConnection) {
      throw new ConflictException(
        "A connection request already exists or you are already connected",
      );
    }

    const [newConnection] = await this.db
      .insert(connections)
      .values({
        senderId,
        receiverId,
        status: "PENDING",
      })
      .returning();

    return newConnection;
  }
}
