module.exports = app => {
        const { existeOuErro, util_console, msgPadraoErro } = app.api.utilitarios

        const save = (req, res) => {
                const clienteBody = req.body
                const codigoSerialParams = Number(req.params.codigo_serial) /* quando vem da api fica codigo-API, função Number remover texto deixando apenas numeros */

                const modelo = {
                        nmr_whatsapp: clienteBody.nmr_whatsapp,
                        nome_cliente: clienteBody.nome_cliente,
                        empresa: clienteBody.empresa,
                        cpf_cnpj: clienteBody.cpf_cnpj,
                        codigo_integracao: clienteBody.codigo_integracao,
                        desativado: clienteBody.desativado,
                }

                try {
                        existeOuErro(modelo.nmr_whatsapp, "[Número WhatsApp*] deve ser preenchido.")
                        /* Se o numero de contato tiver 11 digitos remove o 9. */
                        if (modelo.nmr_whatsapp.length == 11) {
                                modelo.nmr_whatsapp = `${modelo.nmr_whatsapp.substr(0, 2)}${modelo.nmr_whatsapp.substr(3, 10)}`
                        }
                        if (modelo.nmr_whatsapp.length != 10) throw "[Número WhatsApp*] deve ser preenchido com 10 dígito."
                        existeOuErro(modelo.nome_cliente, "[Nome do contato*] deve ser preenchido.")
                } catch (msg) {
                        return res.status(400).send(msg)
                }

                /* Se api = true, atualiza o cadastro na retaguarda(softshop) */
                if (clienteBody.api && codigoSerialParams) {
                        const modeloSoftshop = {
                                Fone: modelo.nmr_whatsapp.substr(2, 10),
                                NomeContato: modelo.nome_cliente,
                                DDD: modelo.nmr_whatsapp.substr(0, 2),
                        }
                        app.db("cadastro de Clientes_Fones")
                                .update(modeloSoftshop)
                                .where({ Sequencia: codigoSerialParams })
                                .then(() => res.status(204).send())
                                .catch(error => {
                                        util_console({ funcao: 'clientes.save', tipo: 'ERRO', mensagem: 'Não foi possível editar cliente(modeloSoftshop).', erro: error, salvarDB: true })
                                        return res.status(500).send(msgPadraoErro)
                                })

                } else {
                        if (codigoSerialParams) {
                                app.db("wpp_cadastro_clientes")
                                        .update(modelo)
                                        .where({ codigo_serial: codigoSerialParams })
                                        .then(() => res.status(204).send())
                                        .catch(error => {
                                                util_console({ funcao: 'clientes.save', tipo: 'ERRO', mensagem: 'Não foi possível editar cliente.', erro: error, salvarDB: true })
                                                return res.status(500).send(msgPadraoErro)
                                        })
                        } else {
                                app.db("wpp_cadastro_clientes")
                                        .insert(modelo)
                                        .then(() => res.status(204).send())
                                        .catch(error => {
                                                util_console({ funcao: 'clientes.save', tipo: 'ERRO', mensagem: 'Não foi possível cadastrar cliente.', erro: error, salvarDB: true })
                                                return res.status(500).send(msgPadraoErro)
                                        })
                        }
                }
        }

        const get = (req, res) => {
                app.db
                        .table("wpp_view_clientes_integrar")
                        .select(
                                "codigo_serial",
                                "nome_cliente",
                                "nmr_whatsapp",
                                "empresa",
                                "codigo_integracao",
                                "cpf_cnpj",
                                "desativado",
                                "api",
                                "cadastrado_em")
                        .whereNull("excluido_em")
                        .orderBy('nome_cliente', 'asc')
                        .then(clientes => res.json(clientes))
                        .catch(error => {
                                util_console({ funcao: 'clientes.get', tipo: 'ERRO-500', mensagem: 'Não foi possível retornar cadastro de clientes.', erro: error, salvarDB: true })
                                return res.status(500).send(msgPadraoErro)
                        })
        }

        const remove = async (req, res) => {
                const codigoParams = req.params.codigo_serial;
                try {
                        const clienteFromDB = await app.db("wpp_cadastro_clientes")
                                .where({ codigo_serial: codigoParams }).first()
                        existeOuErro(clienteFromDB, "Registro não encontrado. <br> Atualize a página e tente novamente.")
                } catch (msg) {
                        return res.status(400).send(msg)
                }
                await app.db("wpp_cadastro_clientes")
                        .update({ excluido_em: app.db.fn.now() })
                        .where({ codigo_serial: codigoParams })
                        .then(() => res.status(204).send())
                        .catch(error => {
                                util_console({ funcao: 'clientes.remove', tipo: 'ERRO-500', mensagem: 'Não foi possível excluir o cliente.', erro: error, salvarDB: true })
                                return res.status(500).send(msgPadraoErro)
                        })
        }

        return { save, get, remove }
}
