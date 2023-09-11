import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Int8 = ColumnType<string, string | number | bigint, string | number | bigint>;

export type Status = "active" | "blocked" | "deactive" | "new";

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type TransactionStatus = "cancelled" | "confirmed" | "pending";

export type TransactionType = "bonus" | "cashback" | "deposit" | "mint" | "payment" | "refund" | "transfer" | "withdraw";

export interface AccessToken {
  id: Generated<string>;
  idUser: string;
  idNamespace: string;
  key: string;
  secret: string;
  expiresAt: Timestamp | null;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

export interface Account {
  id: Generated<string>;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refreshToken: string | null;
  accessToken: string | null;
  expiresAt: Int8 | null;
  tokenType: string | null;
  scope: string | null;
  idToken: string | null;
  sessionState: string | null;
}

export interface Customer {
  id: Generated<string>;
  name: string;
  birthday: Timestamp;
  email: string;
  status: Generated<Status>;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

export interface Namespace {
  id: Generated<string>;
  code: string;
  pic: string | null;
  name: string;
  status: Generated<Status>;
  createdBy: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

export interface NamespaceAccount {
  id: Generated<string>;
  idCustomer: string;
  namespaceCode: string;
  accountNumber: string;
  accountKey: string;
  accountPassword: string | null;
  balance: Generated<number>;
  balanceExtra: Generated<number>;
  status: Generated<Status>;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

export interface NamespaceLimit {
  id: Generated<string>;
  idNamespace: string;
  maxOffer: Generated<number>;
  precision: Generated<number>;
  active: Generated<boolean>;
  expiresAt: Timestamp | null;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

export interface PaymentOrder {
  id: Generated<string>;
  digits: string;
  namespaceCode: string;
  namespaceAccountOrigin: string;
  due: Timestamp;
  amount: number;
  status: Generated<TransactionStatus>;
  createdAt: Generated<Timestamp>;
  payedAt: Timestamp | null;
}

export interface Session {
  id: Generated<string>;
  userId: string;
  sessionToken: string;
  expires: Timestamp;
}

export interface Transaction {
  id: Generated<string>;
  type: TransactionType;
  amount: number;
  headline: Generated<string>;
  details: Generated<string>;
  namespaceCode: string;
  namespaceAccount: string | null;
  namespaceAccountOrigin: string | null;
  namespaceAccountTarget: string | null;
  status: Generated<TransactionStatus>;
  hash: string | null;
  createdAt: Generated<Timestamp>;
  confirmedAt: Timestamp | null;
}

export interface User {
  id: Generated<string>;
  image: string | null;
  name: string;
  email: string;
  emailVerified: Timestamp | null;
  password: string;
  status: Generated<Status>;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

export interface UserLimit {
  id: Generated<string>;
  idUser: string;
  maxNamespace: Generated<number>;
  expiresAt: Timestamp | null;
  active: Generated<boolean>;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

export interface UserNamespace {
  idUser: string;
  idNamespace: string;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
}

export interface VerificationToken {
  identifier: string;
  token: string;
  expires: Timestamp;
}

export interface DB {
  AccessToken: AccessToken;
  Account: Account;
  Customer: Customer;
  Namespace: Namespace;
  NamespaceAccount: NamespaceAccount;
  NamespaceLimit: NamespaceLimit;
  PaymentOrder: PaymentOrder;
  Session: Session;
  Transaction: Transaction;
  User: User;
  UserLimit: UserLimit;
  UserNamespace: UserNamespace;
  VerificationToken: VerificationToken;
}
