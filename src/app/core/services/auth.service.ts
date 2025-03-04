import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { Transaction, User } from '../interfaces/user.interface';
import { v4 as uuidv4 } from 'uuid';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tempUser: Partial<User> = {};
  private localStorageKey = 'users';

  constructor() {
    this.loadUsersFromLocalStorage();
  }

  // Obtener usuarios desde localStorage
  loadUsersFromLocalStorage(): User[] {
    const users = localStorage.getItem('users');

    try {
        const parsedUsers = JSON.parse(users || '[]');

        // 🔍 Si no es un array, conviértelo en un array
        if (!Array.isArray(parsedUsers)) {
            console.warn('El contenido no es un array, convirtiendo a array:', parsedUsers);
            return [parsedUsers]; // Lo envuelve en un array
        }

        return parsedUsers;
    } catch (e) {
        console.error('Error al parsear usuarios desde localStorage:', e);
        return [];
    }
  }



  // Guardar usuarios en localStorage
  saveUsersToLocalStorage(users: User[]) {
    console.log('Guardando en localStorage:', users);
    localStorage.setItem(this.localStorageKey, JSON.stringify(users));
  }

  // Validar si un correo ya existe
  isEmailTaken(email: string): boolean {
    const users = this.loadUsersFromLocalStorage();
    return users.some(user => user.email === email);
  }

  // Guardar datos temporales entre pasos
  setTempUser(data: Partial<User>) {
    this.tempUser = { ...this.tempUser, ...data };
  }

  getTempUser(): Partial<User> {
    return this.tempUser;
  }

  // Guardar el usuario definitivo
  saveUser() {
    let users = this.loadUsersFromLocalStorage();

    // Asegúrate de que users sea siempre un array
    if (!Array.isArray(users)) {
        console.warn('Se esperaba un array en localStorage, pero se encontró:', users);
        users = [];
    }

    // Inicializa las tarjetas y la wallet para el usuario temporal
    this.initializeUser(this.tempUser as User, false);

    // Agregar la fecha de registro al usuario
    (this.tempUser as User).registrationDate = new Date().toISOString();

    users.push(this.tempUser as User);
    this.saveUsersToLocalStorage(users);

    console.log('Usuarios guardados:', users);
    this.tempUser = {};
}

  login(email: string, password: string): {success:boolean, role:number, message:string} {
    const users = this.loadUsersFromLocalStorage();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Guarda solo el email del usuario autenticado en el localStorage
        if (user.isBlocked) {
          return {
            success:false,
            role:1,
            message:'Cuenta bloqueada'
          }
        } else {
          localStorage.setItem('currentUserEmail', user.email);
          return {
            success:true,
            role:user.role,
            message:'logueado'
          };
        }
    } else {
      return {
        success:false,
        role:1,
        message:'Credenciales inválidas'
      };
    }
  }

  // Cerrar sesión
  logout() {
    localStorage.removeItem('currentUserEmail'); // Elimina solo la referencia al usuario logueado
    return true;
  }

  // Obtener el usuario autenticado actual
  getCurrentUser(): User | null {
    const users = this.loadUsersFromLocalStorage();
    const currentUserEmail = localStorage.getItem('currentUserEmail');

    if (currentUserEmail) {
        const user = users.find(u => u.email === currentUserEmail);
        return user || null;
    }

    console.warn('No hay un usuario autenticado');
    return null;
  }



  // Actualizar la información del usuario autenticado
  private updateCurrentUser(user: User) {
    console.log('Usuario recibido para actualizar:', user);

    const users = this.loadUsersFromLocalStorage().map(u => {
        console.log('Comparando:', u.email, 'con', user.email);
        return u.email?.trim().toLowerCase() === user.email?.trim().toLowerCase() ? user : u;
    });

    this.saveUsersToLocalStorage(users);
    console.log('Usuarios actualizados:', users);
  }

  // Recargar saldo en una tarjeta específica
  // Recargar saldo en una tarjeta específica
  rechargeCard(cardId: string, amount: number, reason: string, walletAddress: string) {
    const user = this.getCurrentUser();
    if (user) {
        const card = user.cards.find(c => c.id === cardId);
        if (card) {
            card.balance += amount;

            // Guardar transacción en el historial con la fecha actual
            const transaction: Transaction = {
                id: uuidv4(),
                amount,
                reason,
                walletAddress,
                date: new Date().toISOString(), // Fecha de transacción actual
                cardId,
                transactionDate: new Date().toISOString()
            };

            user.transactions.push(transaction);
            this.updateCurrentUser(user);
        }
    }
  };

  // Transferir saldo desde una tarjeta específica
  transfer(
    fromCardId: string, // Tarjeta de origen
    amount: number,
    reason: string,
    walletAddress: string
  ) {
    const user = this.getCurrentUser();
    if (user) {
        const sourceCard = user.cards.find(c => c.id === fromCardId);
        if (sourceCard && sourceCard.balance >= amount) {
            sourceCard.balance -= amount;

            // Guardar la transacción en el historial con la fecha actual
            const transaction: Transaction = {
                id: uuidv4(),
                amount: -amount, // Cantidad negativa para indicar salida de fondos
                reason,
                walletAddress,
                date: new Date().toISOString(), // Fecha de transacción actual
                cardId: fromCardId,
                transactionDate: new Date().toISOString()
            };

            user.transactions.push(transaction);
            this.updateCurrentUser(user);
        }
    }
  }

  // Crear tarjetas físicas y virtuales al registrar un usuario
  initializeUserCards(user: User) {
    user.cards = [
      { id: uuidv4(), type: 'physical', balance: 0, number: this.generateCardNumber(), expDate: this.generateExpDate(), cvc: this.generateCVC(), activated: false, isFrozen:false },
      { id: uuidv4(), type: 'virtual', balance: 0, number: this.generateCardNumber(), expDate: this.generateExpDate(), cvc: this.generateCVC(), activated: false, isFrozen:false }
    ];
    user.transactions = [];
  }


  // Generar un número de tarjeta aleatorio (16 dígitos)
  private generateCardNumber(): number {
      return Number(Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join(''));
  }

  // Generar una fecha de vencimiento aleatoria (MM/YY)
  private generateExpDate(): string {
      const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      const year = String(new Date().getFullYear() + Math.floor(Math.random() * 5)).slice(2);
      return `${month}/${year}`;
  }

  // Generar un CVC aleatorio (3 dígitos)
  private generateCVC(): number {
      return Math.floor(100 + Math.random() * 900);
  }

  initializeUser(user: User, isAdmin: boolean = false) {
    this.initializeUserCards(user);
    this.initializeUserWallet(user);
    user.transactions = [];
    user.role = isAdmin ? 1 : 2; // 1 = Admin, 2 = Usuario normal
  }

  initializeUserWallet(user: User) {
    user.wallet = {
        id: uuidv4(),
        name: 'Mi Wallet',
        balance: 0
    };
  };

  // Recargar saldo en la wallet del usuario
  rechargeWallet(amount: number, reason: string) {
    const user = this.getCurrentUser();

    if (user && user.wallet) {
        user.wallet.balance += amount;

        // Guardar transacción en el historial
        const transaction: Transaction = {
            id: uuidv4(),
            amount,
            reason,
            walletAddress: user.wallet.id,
            date: new Date().toISOString(),
            cardId: 'WALLET',
            transactionDate: new Date().toISOString()
        };

        user.transactions.push(transaction);
        this.updateCurrentUser(user);
        console.log(`Se recargó la wallet con $${amount}`);
    } else {
        console.error('No se encontró la wallet del usuario.');
    }
  };

  initializeAdminUser(email:string, password:string, fullName:string ):boolean {
    const users = this.loadUsersFromLocalStorage();

    if (this.isEmailTaken(email)) {
        return false;
    } else {
      // Verificar si ya existe un usuario administrador
      const adminUser: User = {
          email: email,
          password: password,
          cards: [],
          transactions: [],
          wallet: { id: '', name: '', balance: 0 },
          role: 1,
          fullName:fullName,
          address:'',
          phone:'',
          country:'',
          registrationDate : new Date().toISOString(),
          isBlocked: false
      };

      // Inicializar tarjetas y wallet
      this.initializeUser(adminUser, true);

      // Guardar el usuario administrador en el localStorage
      users.push(adminUser);
      this.saveUsersToLocalStorage(users);
      return true
    }
  };

  // ❄️ Congelar una tarjeta (puede hacerlo el usuario o un administrador)
  freezeCard(userEmail: string, cardId: string) {
    let users = this.loadUsersFromLocalStorage()
    const adminUser = this.getCurrentUser(); // Usuario actual (quien ejecuta la acción)
    let targetUser = users.find(u => u.email === userEmail); // Usuario dueño de la tarjeta

    if (!adminUser || !targetUser) {
      console.warn("Usuario no encontrado.");
      return false;
    }

    // Solo el usuario dueño o un administrador pueden congelar la tarjeta
    if (adminUser.email !== targetUser.email && adminUser.role !== 1) {
      console.warn("No tienes permiso para congelar esta tarjeta.");
      return false;
    }

    const card = targetUser.cards.find(c => c.id === cardId);
    if (card) {
      card.isFrozen = true;
      this.updateCurrentUser(targetUser);
      console.log(`Tarjeta ${cardId} congelada por ${adminUser.role === 1 ? 'un administrador' : 'el usuario'}.`);
      return true;
    }

    return false
  }

  // 🔓 Descongelar una tarjeta (mismas reglas que congelar)
  unfreezeCard(email: string, cardId: string) {
    let users = this.loadUsersFromLocalStorage()

    const adminUser = this.getCurrentUser();
    let targetUser = users.find(u => u.email === email);

    if (!adminUser || !targetUser) {
      console.warn("Usuario no encontrado.");
      return false;
    }

    if (adminUser.email !== targetUser.email && adminUser.role !== 1) {
      console.warn("No tienes permiso para descongelar esta tarjeta.");
      return false;
    }

    const card = targetUser.cards.find(c => c.id === cardId);
    if (card) {
      card.isFrozen = false;
      this.updateCurrentUser(targetUser);
      console.log(`Tarjeta ${cardId} descongelada por ${adminUser.role === 1 ? 'un administrador' : 'el usuario'}.`);
      return true
    }
    return false
  }

  blockUser(userEmail: string) {
    let users = this.loadUsersFromLocalStorage()

    const adminUser = this.getCurrentUser();
    let targetUser = users.find(u => u.email === userEmail);

    if (!adminUser || adminUser.role !== 1) {
      console.warn("No tienes permiso para bloquear usuarios.");
      return {
        success: false,
        message: "No tienes permiso para bloquear usuarios."
      }
    }

    if (!targetUser) {
      return {
        success: false,
        message:"Usuario no encontrado."
      };
    }
    targetUser.isBlocked = true;
    this.updateCurrentUser(targetUser);
    console.log(`Usuario ${targetUser.email} bloqueado.`);
    return {
      success:true,
      message:'Usuario bloqueado'
    }
  }

  // ✅ Desbloquear usuario (solo admin)
  unblockUser(userEmail: string) {
    let users = this.loadUsersFromLocalStorage()
    const adminUser = this.getCurrentUser();
    let targetUser = users.find(u => u.email === userEmail);

    if (!adminUser || adminUser.role !== 1) {
      return {
        success: false,
        message: "No tienes permiso para bloquear usuarios."
      }
    }

    if (!targetUser) {
      return {
        success: false,
        message:"Usuario no encontrado."
      }
    }
    targetUser.isBlocked = false;
    this.updateCurrentUser(targetUser);
    console.log(`Usuario ${targetUser.email} desbloqueado.`);
    return {
      success:true,
      message:'Usuario desbloqueado'
    }
  }

  editUser(email: string, updatedData: Partial<User>) {
    const currentUser = this.getCurrentUser();
    let users = this.loadUsersFromLocalStorage();

    let targetUser = users.find(u => u.email === email);
    if (!targetUser) {
      return {
        message: "Usuario no encontrado.",
        success:false
      };
    }

    // Verificar permisos: el usuario solo puede editarse a sí mismo, el admin a todos
    if (currentUser?.role !== 1 && currentUser?.email !== email) {
      return {
        message: "No tienes permiso para editar este usuario.",
        success:false
      };
    }

    // Solo actualizar los campos permitidos
    targetUser.fullName = updatedData.fullName ?? targetUser.fullName;
    targetUser.address = updatedData.address ?? targetUser.address;
    targetUser.phone = updatedData.phone ?? targetUser.phone;
    targetUser.country = updatedData.country ?? targetUser.country;

    // Guardar cambios en localStorage
    this.saveUsersToLocalStorage(users);
    console.log(`Usuario ${targetUser.email} actualizado.`);
    return {
      message:"Usuario editado",
      success:true
    };
  }

  activateCard(email: string, cardId: string) {
    const users = this.loadUsersFromLocalStorage();
    const user = users.find(u => u.email === email);

    if (!user) {
      console.warn("Usuario no encontrado.");
      return false;
    }

    const card = user.cards.find(c => c.id === cardId);
    if (!card) {
      console.warn("Tarjeta no encontrada.");
      return false;
    }

    if (card.activated) {
      console.warn("La tarjeta ya está activada.");
      return false;
    }

    card.activated = true;
    this.saveUsersToLocalStorage(users);
    console.log(`Tarjeta ${cardId} activada correctamente.`);
    return true;
  }


}
