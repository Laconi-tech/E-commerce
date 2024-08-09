CREATE TABLE categorie
(
    id INT
    AUTO_INCREMENT NOT NULL,
    categorie VARCHAR
    (255) NOT NULL,
    PRIMARY KEY
    (id)
) DEFAULT CHARACTER
    SET utf8mb4
    COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;

    CREATE TABLE pays
    (
        id INT
        AUTO_INCREMENT NOT NULL,
    nom VARCHAR
        (255) NOT NULL,
    PRIMARY KEY
        (id)
) DEFAULT CHARACTER
        SET utf8mb4
        COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;

        CREATE TABLE client
        (
            id INT
            AUTO_INCREMENT NOT NULL,
    email VARCHAR
            (255) NOT NULL,
    password VARCHAR
            (255) NOT NULL,
    nom VARCHAR
            (255) NOT NULL,
    prenom VARCHAR
            (255) NOT NULL,
    adresse VARCHAR
            (255) NOT NULL,
    ville VARCHAR
            (255),
    is_admin TINYINT
            (1) NOT NULL DEFAULT 0,
    id_pays INT,
    PRIMARY KEY
            (id),
    FOREIGN KEY
            (id_pays) REFERENCES pays
            (id) ON
            DELETE CASCADE
) DEFAULT CHARACTER
            SET utf8mb4
            COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;


            CREATE TABLE article
            (
                id INT
                AUTO_INCREMENT NOT NULL,
    description VARCHAR
                (255) NOT NULL,
    photo VARCHAR
                (255) DEFAULT NULL,
    caracteristiques VARCHAR
                (14000) DEFAULT NULL,
    prix DOUBLE PRECISION NOT NULL,
    stock INT NOT NULL,
    id_categorie INT NOT NULL DEFAULT 0,
    photo_url VARCHAR
                (255) NOT NULL,
    consultation INT DEFAULT 0,
    PRIMARY KEY
                (id),
    FOREIGN KEY
                (id_categorie) REFERENCES categorie
                (id) ON
                DELETE CASCADE
) DEFAULT CHARACTER
                SET utf8mb4
                COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;

                CREATE TABLE panier
                (
                    id INT
                    AUTO_INCREMENT NOT NULL,
    id_client INT NOT NULL,
    prix_total DOUBLE PRECISION NOT NULL,
    PRIMARY KEY
                    (id),
    FOREIGN KEY
                    (id_client) REFERENCES client
                    (id) ON
                    DELETE CASCADE
) DEFAULT CHARACTER
                    SET utf8mb4
                    COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;

                    CREATE TABLE panier_article
                    (
                        id_panier INT NOT NULL,
                        id_article INT NOT NULL,
                        PRIMARY KEY (id_panier, id_article),
                        FOREIGN KEY (id_panier) REFERENCES panier(id) ON DELETE CASCADE,
                        FOREIGN KEY (id_article) REFERENCES article(id) ON DELETE CASCADE
                    )
                    DEFAULT CHARACTER
                    SET utf8mb4
                    COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;

                    CREATE TABLE orders
                    (
                        id INT
                        AUTO_INCREMENT NOT NULL,
    id_client INT NOT NULL,
    id_panier INT NOT NULL,
    date DATETIME NOT NULL,
    PRIMARY KEY
                        (id),
    FOREIGN KEY
                        (id_client) REFERENCES client
                        (id) ON
                        DELETE CASCADE,
    FOREIGN KEY (id_panier)
                        REFERENCES panier
                        (id) ON
                        DELETE CASCADE
) DEFAULT CHARACTER
                        SET utf8mb4
                        COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;

                        CREATE TABLE messenger_messages
                        (
                            id BIGINT
                            AUTO_INCREMENT NOT NULL,
    body LONGTEXT NOT NULL,
    headers LONGTEXT NOT NULL,
    queue_name VARCHAR
                            (190) NOT NULL,
    created_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)',
    available_at DATETIME NOT NULL COMMENT '(DC2Type:datetime_immutable)',
    delivered_at DATETIME DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)',
    INDEX IDX_75EA56E0FB7336F0
                            (queue_name),
    INDEX IDX_75EA56E0E3BD61CE
                            (available_at),
    INDEX IDX_75EA56E016BA31DB
                            (delivered_at),
    PRIMARY KEY
                            (id)
) DEFAULT CHARACTER
                            SET utf8mb4
                            COLLATE utf8mb4_unicode_ci ENGINE = InnoDB;
