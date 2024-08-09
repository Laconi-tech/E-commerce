<?php

namespace App\Entity;

use App\Repository\MoyenDePaiementRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MoyenDePaiementRepository::class)]
class MoyenDePaiement
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(nullable: true)]
    private ?int $client_id = null;

    #[ORM\Column(length: 255)]
    private ?string $NOM = null;

    #[ORM\Column(length: 255)]
    private ?string $TYPE = null;

    #[ORM\Column(name: "NumeroCarte", length: 16)]
    private ?string $NumeroCarte = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getClientId(): ?int
    {
        return $this->client_id;
    }

    public function setClientId(?int $client_id): static
    {
        $this->client_id = $client_id;

        return $this;
    }

    public function getNOM(): ?string
    {
        return $this->NOM;
    }

    public function setNOM(string $NOM): static
    {
        $this->NOM = $NOM;

        return $this;
    }

    public function getTYPE(): ?string
    {
        return $this->TYPE;
    }

    public function setTYPE(string $TYPE): static
    {
        $this->TYPE = $TYPE;

        return $this;
    }

    public function getNumeroCarte(): ?string
    {
        return $this->NumeroCarte;
    }

    public function setNumeroCarte(string $NumeroCarte): static
    {
        $this->NumeroCarte = $NumeroCarte;

        return $this;
    }
}
