<?php

namespace App\Entity;

use App\Repository\OrderRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: OrderRepository::class)]
#[ORM\Table(name: 'orders')]
class Order
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    
       /**
     * @ORM\ManyToOne(targetEntity=Client::class)
     * @ORM\JoinColumn(name="id_client", referencedColumnName="id")
     */
    #[ORM\Column(nullable: true)]
    private ?int $id_client = null;

    #[ORM\Column]
    private ?int $id_panier = null;
    /**
     * @ORM\ManyToOne(targetEntity=Client::class)
     * @ORM\JoinColumn(name="id_client", referencedColumnName="id")
     */

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column] 
    private ?float $prix = null;

    /**
     * [ORM\ManyToOne(targetEntity: Pays::class)]
     * [ORM\JoinColumn(name: "id_pays", referencedColumnName: "id")]
     */

    #[ORM\Column]
    private ?int $id_pays = null;
    
    #[ORM\Column(length: 14000)]
    private ?string $adresse = null;

    #[ORM\Column(length: 500 )]
    private ?string $ville = null;

    #[ORM\Column(type: 'boolean')]
    private bool $isExpedited = false;

    #[ORM\Column(length: 500)]
    private ?string $commandeId = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdClient(): ?int
    {
        return $this->id_client;
    }

    public function setIdClient(int $id_client): static
    {
        $this->id_client = $id_client;

        return $this;
    }

    public function getIdPanier(): ?int
    {
        return $this->id_panier;
    }

    public function setIdPanier(int $id_panier): static
    {
        $this->id_panier = $id_panier;

        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): static
    {
        $this->date = $date;

        return $this;
    }

    public function getPrix() : ?float
    {
        return $this->prix;
    }

    public function setPrix(float $prix) : static
    {
        $this->prix = $prix;
        return $this;
    }

    public function getIdPays(): ?int
    {
        return $this->id_pays;
    }

    public function setIdPays(int $id_pays): static 
    {
        $this->id_pays = $id_pays;
    
        return $this;
    }

    public function getAdresse() : ?string
    {
        return $this->adresse;
    }

    public function setAdresse(string $adresse) : static
    {
        $this->adresse = $adresse;
        return $this;
    }

    public function getVille() : ?string
    {
        return $this->ville;
    }

    public function setVille(string $ville) : static
    {
        $this->ville = $ville;
        return $this;
    }

    public function getIsExpedited(): bool
    {
        return $this->isExpedited;
    }

    public function setIsExpedited(bool $isExpedited): static
    {
        $this->isExpedited = $isExpedited;
        return $this;
    }

    public function getCommandeId(): ?string
    {
        return $this->commandeId;
    }

    public function setCommandeId(?string $commandeId): static
    {
        $this->commandeId = $commandeId;
        return $this;
    }
    
}
