<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Article;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class PopularArticleController extends AbstractController
{
     /** 
     *@Route("/api/populararticle", name="api_article_popular")
     */
    public function getPopularArticle(EntityManagerInterface $entityManager)
    {
        $articleRepository = $entityManager->getRepository(Article::class);
        $articles = $articleRepository->findBy([], ['consultation' => 'DESC'], 3);

        $articleArray = [];
        foreach ($articles as $article) {

            $articleArray[] = [
                'id' => $article->getId(),
                'description' => $article->getDescription(),
                'photo' => $article->getPhoto(),
                'photo_url' => $article->getPhotoUrl(),
                'caracteristiques' => $article->getCaracteristiques(),
                'prix' => $article->getPrix(),
                'stock' => $article->getStock(),
                'id_categorie' => $article->getIdCategorie(),
                'consultation' => $article->getConsultation(),
                'rabais' => $article->getRabaisPct(),
            ];
        }

        return new JsonResponse($articleArray);
    }
}
