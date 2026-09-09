-- 1. SELECT + WHERE
SELECT id, nome, categoria, preco, estoque
FROM produtos
WHERE estoque < 10;

-- 2. JOIN entre vendas, clientes e produtos
SELECT
    v.id,
    c.nome AS cliente,
    p.nome AS produto,
    v.quantidade,
    v.preco_unitario,
    v.quantidade * v.preco_unitario AS total
FROM vendas v
JOIN clientes c ON c.id = v.cliente_id
JOIN produtos p ON p.id = v.produto_id;

-- 3. INSERT
INSERT INTO clientes (nome, email, cidade)
VALUES ('Ana Silva', 'ana@email.com', 'Campina Grande');

-- 4. UPDATE
UPDATE produtos
SET estoque = estoque + 20
WHERE id = 1;

-- 5. Indicador de faturamento por categoria
SELECT
    p.categoria,
    SUM(v.quantidade * v.preco_unitario) AS faturamento
FROM vendas v
JOIN produtos p ON p.id = v.produto_id
GROUP BY p.categoria
ORDER BY faturamento DESC;
