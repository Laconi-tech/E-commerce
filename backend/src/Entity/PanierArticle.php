<?php

namespace App\Entity;

use App\Repository\PanierArticleRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PanierArticleRepository::class)]
class PanierArticle
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;
    
    /**
     * @ORM\ManyToOne(targetEntity=Article::class)
     * @ORM\JoinColumn(name="id_article", referencedColumnName="id")
     */
    #[ORM\Column(nullable: true)]
    private ?int $id_article = null;

    /**
     * @ORM\ManyToOne(targetEntity=Panier::class)
     * @ORM\JoinColumn(name="id_panier", referencedColumnName="id")
     */
    #[ORM\Column(nullable: true)]
    private ?int $id_panier = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getIdArticle(): ?int
    {
        return $this->id_article;
    }

    public function setIdArticle(?int $id_article): static
    {
        $this->id_article = $id_article;

        return $this;
    }

    public function getIdPanier(): ?int
    {
        return $this->id_panier;
    }

    public function setIdPanier(?int $id_panier): static
    {
        $this->id_panier = $id_panier;

        return $this;
    }
}
