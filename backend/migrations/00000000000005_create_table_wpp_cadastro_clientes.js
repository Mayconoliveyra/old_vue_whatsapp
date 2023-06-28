exports.up = function (knex) {
        return knex.schema.createTable("wpp_cadastro_clientes", table => {
                table.increments("codigo_serial").primary()
                table.string("nome_cliente", 191)
                table.string("nmr_whatsapp", 10).notNull() /* xx xxxx xxxx */
                table.string("empresa", 191)
                table.string("cpf_cnpj", 191)
                table.string("codigo_integracao", 191)
                table.boolean("desativado", 1).notNull().defaultTo(0)
                table.timestamp('cadastrado_em').defaultTo(knex.fn.now())
                table.timestamp('excluido_em')
        }).then(function () {
                return knex("wpp_cadastro_clientes").insert([
                        {
                                nome_cliente: 'Mãe',
                                nmr_whatsapp: "8398575993",
                        },
                        {
                                nome_cliente: 'Caline',
                                nmr_whatsapp: "8398382198",
                        },
                        {
                                nome_cliente: 'Deposito Cazimi',
                                nmr_whatsapp: "8399847569",
                        },
                        {
                                nome_cliente: 'Depósito Cazimi',
                                nmr_whatsapp: "8399847569",
                        },
                        {
                                nome_cliente: 'Jose Irmão',
                                nmr_whatsapp: "8396468517",
                        },
                        {
                                nome_cliente: 'Anny',
                                nmr_whatsapp: "8181374480",
                        },
                        {
                                nome_cliente: 'Mayla',
                                nmr_whatsapp: "8387967390",
                        },
                ])
        })
};

exports.down = function (knex) {
        return knex.schema.dropTable("wpp_cadastro_clientes")
};
