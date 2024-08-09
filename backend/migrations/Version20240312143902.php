<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240312143902 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE article CHANGE photo_url photo_url VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE moyen_de_paiement CHANGE type type VARCHAR(255) NOT NULL, CHANGE NumeroCarte NumeroCarte VARCHAR(16) NOT NULL');
        $this->addSql('ALTER TABLE pays ADD frais_de_port INT NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE moyen_de_paiement CHANGE type type VARCHAR(255) DEFAULT NULL, CHANGE NumeroCarte NumeroCarte VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE article CHANGE photo_url photo_url TEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE pays DROP frais_de_port');
    }
}
