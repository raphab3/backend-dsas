import { IPersonSig } from '@modules/persosnSig/interfaces/IPersonSig';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('persons_sig')
export class PersonSig implements IPersonSig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  patente: string;

  @Column({ type: 'varchar', nullable: true })
  nome: string;

  @Column({ type: 'varchar', nullable: true })
  funcao: string;

  @Column({ type: 'varchar', nullable: true })
  identidade_militar: number;

  @Column({ type: 'varchar', nullable: true })
  data_nascimento: string | Date;

  @Column({ type: 'varchar', nullable: true })
  cod_unidade: number;

  @Column({ type: 'varchar', nullable: true })
  unidade: string;

  @Column({ type: 'varchar', nullable: true })
  imagem: string;

  @Column({ type: 'varchar', nullable: true })
  nome_guerra: string;

  @Column({ type: 'varchar', nullable: true })
  admissao: string | Date;

  @Column({ type: 'varchar', unique: true })
  matricula: string;

  @Column({ type: 'varchar', nullable: true })
  regime: string;

  @Column({ type: 'varchar', nullable: true })
  cpf: string;

  @Column({ type: 'varchar', nullable: true })
  carteira_motorista: number;

  @Column({ type: 'varchar', nullable: true })
  vencimento_motorista: string | Date;

  @Column({ type: 'varchar', nullable: true })
  sexo: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  pai: string;

  @Column({ type: 'varchar', nullable: true })
  mae: string;

  @Column({ type: 'varchar', nullable: true })
  naturalidade: string;

  @Column({ type: 'varchar', nullable: true })
  estado_civil: string;

  @Column({ type: 'varchar', nullable: true })
  ddd: string;

  @Column({ type: 'varchar', nullable: true })
  telefone: string;

  @Column({ type: 'varchar', nullable: true })
  endereco: string;

  @Column({ type: 'varchar', nullable: true })
  numero: string;

  @Column({ type: 'varchar', nullable: true })
  complemento: string;

  @Column({ type: 'varchar', nullable: true })
  bairro: string;

  @Column({ type: 'varchar', nullable: true })
  cidade: string;

  @Column({ type: 'varchar', nullable: true })
  estado: string;

  @Column({ type: 'varchar', nullable: true })
  cep: number;

  @Column({ type: 'varchar', nullable: true })
  rg: number;

  @Column({ type: 'varchar', nullable: true })
  orgao_exp: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
