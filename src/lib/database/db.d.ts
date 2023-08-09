import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Status = "active" | "blocked" | "deactive" | "new";

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type TransactionStatus = "cancelled" | "confirmed" | "pending";

export type TransactionType = "bonus" | "cashback" | "deposit" | "mint" | "payment" | "refund" | "transfer" | "withdraw";

export interface AccessToken {
  id: Generated<number>;
  id_user: number;
  id_namespace: number;
  key: string;
  secret: string;
  expires_at: Timestamp | null;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

export interface Account {
  id: Generated<number>;
  id_customer: number;
  namespace_code: string;
  account_number: string;
  account_key: string;
  account_password: string | null;
  balance: Generated<number>;
  balance_extra: Generated<number>;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

export interface Customer {
  id: Generated<number>;
  name: string;
  birthday: Timestamp;
  email: string;
  document: string;
  status: Generated<Status>;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

export interface Namespace {
  id: Generated<number>;
  code: string;
  pic: string | null;
  name: string;
  status: Generated<Status>;
  created_by: number;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

export interface NamespaceLimit {
  id: Generated<number>;
  id_namespace: number;
  max_offer: Generated<number>;
  precision: Generated<number>;
  expires_at: Timestamp | null;
  active: Generated<boolean>;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

export interface PaymentOrder {
  id: Generated<number>;
  digits: string;
  namespace_code: string;
  id_account_origin: string;
  due: Timestamp;
  amount: number;
  status: Generated<TransactionStatus>;
  created_at: Generated<Timestamp>;
  payed_at: Timestamp | null;
}

export interface Transaction {
  id: Generated<number>;
  type: TransactionType;
  amount: number;
  headline: Generated<string>;
  details: Generated<string>;
  namespace_code: string;
  id_account: string;
  id_account_origin: string | null;
  id_account_target: string;
  status: Generated<TransactionStatus>;
  hash: string | null;
  created_at: Generated<Timestamp>;
  confirmed_at: Timestamp | null;
}

export interface User {
  id: Generated<number>;
  name: string;
  email: string;
  password: string;
  status: Generated<Status>;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

export interface UserLimit {
  id: Generated<number>;
  id_user: number;
  max_namespace: Generated<number>;
  expires_at: Timestamp | null;
  active: Generated<boolean>;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

export interface UserNamespace {
  id_user: number;
  id_namespace: number;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

export interface DB {
  access_token: AccessToken;
  account: Account;
  customer: Customer;
  namespace: Namespace;
  namespace_limit: NamespaceLimit;
  payment_order: PaymentOrder;
  transaction: Transaction;
  user: User;
  user_limit: UserLimit;
  user_namespace: UserNamespace;
}
