const db = require("../utils/database.js");

class User {
  constructor(username, roomId, socketId) {
    this.username = username;
    this.roomId = roomId;
    this.socketId = socketId;
    this.type = "WAITING";
  }
  //-------------------------------------------------------------------------------------------------------
  async CreateUser() {
    try {
      const numberOfUsers = await this.getUser(this.username, this.roomId);
      if (numberOfUsers !== 0) {
        return JSON.parse({
          message:
            "Please change the username as the same username is in the room",
        });
      } else {
        const query = `INSERT INTO users VALUES ( '${this.username}', '${this.roomId}' , 'WAITING' , '${this.socketId}' )`;
        await db.execute(query);
        return this;
      }
    } catch (error) {
      console.log(error);
    }
  }
  //-------------------------------------------------------------------------------------------------------
  async getUser(username, roomId) {
    const query = ` SELECT count(*) as cnt FROM users WHERE users.username = ? AND users.room_id = ?;`;
    const [rows, fields] = await db.execute(query, [username, roomId]);
    console.log(rows[0].cnt);
    return rows[0].cnt;
  }
  //-------------------------------------------------------------------------------------------------------
  static async getUserBySocketId(socketId) {
    const query = ` SELECT * 
                    FROM users
                    WHERE   socket_id = '${socketId}'
    `;
    return await db.execute(query);
  }
  //-------------------------------------------------------------------------------------------------------
  static async getSpecificUsers(roomId, type) {
    const query = ` SELECT * 
                    FROM users
                    WHERE   room_id = '${roomId}' AND 
                            type = '${type}'
    `;
    return await db.execute(query);
  }
  //-------------------------------------------------------------------------------------------------------
  static async getCnt(roomId, type) {
    const query = ` SELECT COUNT(*) as cnt 
                    FROM USERS 
                    WHERE room_id='${roomId}' and type ='${type}'
    `;
    return await db.execute(query);
  }
  //-------------------------------------------------------------------------------------------------------
  static async updateUserType(username,roomId, type) {
    const query = `UPDATE USERS SET type='${type}' WHERE username= '${username}' AND room_id='${roomId}'`;
    return await db.execute(query);
  }

}

module.exports = User;
