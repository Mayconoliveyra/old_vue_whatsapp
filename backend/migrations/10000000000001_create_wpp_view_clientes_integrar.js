
exports.up = function (knex) {
        return knex.raw(`
        CREATE VIEW wpp_view_clientes_integrar 
        AS SELECT 
        CONCAT(CAST([Sequencia] as VARCHAR), '-API') AS codigo_serial, 
        NomeContato AS nome_cliente, 
        (case LEN([DDD]+[Fone]) 
              when 11 then LEFT([DDD]+[Fone],2)+
              RIGHT([DDD]+[Fone],8) 
                        else [DDD]+[Fone] end) AS nmr_whatsapp, 
        [Nome do Cliente] AS empresa, 
        CAST([CGC] as VARCHAR) AS cpf_cnpj, 
        CAST([Código do Cliente] as VARCHAR) AS codigo_integracao,
        [Desativado] AS desativado,
        1 AS api,
        [DataCadastro] AS cadastrado_em,
        Null AS excluido_em
        FROM [Cadastro de Clientes] 
        INNER JOIN [cadastro de Clientes_Fones] 
        ON [Código do Cliente] = CodigoDoCliente
        
        UNION 
        SELECT 
        CAST([codigo_serial] as VARCHAR) AS codigo_serial,  
        nome_cliente, 
        nmr_whatsapp,  
        empresa, 
        cpf_cnpj, 
        codigo_integracao,
        desativado,
        0 AS api,
        cadastrado_em,
        excluido_em
        FROM wpp_cadastro_clientes
      `);
};

exports.down = function (knex) {
        return knex.raw('DROP VIEW wpp_view_clientes_integrar');
};
