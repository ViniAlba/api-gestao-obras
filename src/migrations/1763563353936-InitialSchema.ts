import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1763563353936 implements MigrationInterface {
    name = 'InitialSchema1763563353936'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying(255) NOT NULL, "role" character varying(50) NOT NULL DEFAULT 'viewer', "criadoEm" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizadoEm" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "trabalhadores" ("idEmpregado" SERIAL NOT NULL, "idGerente" integer, "nome" character varying(255) NOT NULL, "cpfCnpj" character varying(30) NOT NULL, "rgie" character varying(30) NOT NULL, "salario" numeric(10,2) NOT NULL, "ctps" character varying(50) NOT NULL, "funcao" character varying(100) NOT NULL, "criadoEm" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizadoEm" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_597347f7a2c46a3d16784d8f65d" UNIQUE ("cpfCnpj"), CONSTRAINT "UQ_209f091a9b2ef21254fb8d07d70" UNIQUE ("ctps"), CONSTRAINT "PK_84bc3ad2511d907c9b07f4f5ef7" PRIMARY KEY ("idEmpregado"))`);
        await queryRunner.query(`CREATE TABLE "clientes" ("idCliente" SERIAL NOT NULL, "nome" character varying(255) NOT NULL, "endereco" character varying(300) NOT NULL, "telefone" character varying(20) NOT NULL, "cpfCnpj" character varying(30) NOT NULL, "rgIe" character varying(30) NOT NULL, "criadoEm" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizadoEm" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_d5ac12f1cb59cbcffd7488b9ae5" UNIQUE ("cpfCnpj"), CONSTRAINT "PK_5efa812bf69403e1b25d36b7405" PRIMARY KEY ("idCliente"))`);
        await queryRunner.query(`CREATE TABLE "engenheiros" ("idEngenheiro" SERIAL NOT NULL, "nome" character varying(255) NOT NULL, "telefone" character varying(20) NOT NULL, "endereco" character varying(300) NOT NULL, "crea" character varying(50) NOT NULL, "certificacoesAdicionais" text, "criadoEm" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizadoEm" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_90262708d48ab8d3f9506e66993" UNIQUE ("crea"), CONSTRAINT "PK_7d01694639ba8e030dbe31bc05f" PRIMARY KEY ("idEngenheiro"))`);
        await queryRunner.query(`CREATE TABLE "obras" ("idObra" SERIAL NOT NULL, "idCliente" integer NOT NULL, "idEngenheiro" integer NOT NULL, "tipoobra" character varying(100) NOT NULL, "enderecoobra" character varying(300) NOT NULL, "dataInicio" date NOT NULL, "prevTermino" date NOT NULL, "valorTotal" numeric(12,2) NOT NULL, "formaPagamento" character varying(100) NOT NULL, "status" character varying(50) NOT NULL, "alvarasLicencas" text, "contrato" character varying(100), "criadoEm" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizadoEm" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_3e762afbe182e4d07fe6fae448e" PRIMARY KEY ("idObra"))`);
        await queryRunner.query(`CREATE TABLE "empreiteiras" ("idEmp" SERIAL NOT NULL, "cnpjCpf" character varying(30) NOT NULL, "nome" character varying(255) NOT NULL, "telefone" character varying(20) NOT NULL, "email" character varying(100) NOT NULL, "fundacao" date, "licencas" text, "criadoEm" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizadoEm" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_290c62d47fa27be9feba44dcffa" UNIQUE ("cnpjCpf"), CONSTRAINT "UQ_2b5ecd5e4638c344b3f97caaed9" UNIQUE ("email"), CONSTRAINT "PK_2981c05322e9dec19b7939564b3" PRIMARY KEY ("idEmp"))`);
        await queryRunner.query(`ALTER TABLE "trabalhadores" ADD CONSTRAINT "FK_2b54524bdfb576afca4ac88efa7" FOREIGN KEY ("idGerente") REFERENCES "trabalhadores"("idEmpregado") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "obras" ADD CONSTRAINT "FK_ed5a4198e4dbff5fe091eafacbe" FOREIGN KEY ("idCliente") REFERENCES "clientes"("idCliente") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "obras" ADD CONSTRAINT "FK_b3d5abbcb392ed9c3d9bb98cfb0" FOREIGN KEY ("idEngenheiro") REFERENCES "engenheiros"("idEngenheiro") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "obras" DROP CONSTRAINT "FK_b3d5abbcb392ed9c3d9bb98cfb0"`);
        await queryRunner.query(`ALTER TABLE "obras" DROP CONSTRAINT "FK_ed5a4198e4dbff5fe091eafacbe"`);
        await queryRunner.query(`ALTER TABLE "trabalhadores" DROP CONSTRAINT "FK_2b54524bdfb576afca4ac88efa7"`);
        await queryRunner.query(`DROP TABLE "empreiteiras"`);
        await queryRunner.query(`DROP TABLE "obras"`);
        await queryRunner.query(`DROP TABLE "engenheiros"`);
        await queryRunner.query(`DROP TABLE "clientes"`);
        await queryRunner.query(`DROP TABLE "trabalhadores"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
