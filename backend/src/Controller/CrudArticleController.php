<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Article;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;

class CrudArticleController extends AbstractController
{
    #[Route('/api/modif', methods:['POST'])]
    public function update(EntityManagerInterface $entityManager): Response
    {
        $id = $_POST['id'];
        $modif = $entityManager->getRepository(Article::class)->find($id);

        if (!$modif) {
            throw $this->createNotFoundException(
                'No product found for id '.$id
            );
        }

        if ($_POST['categorie'] != '') {
            $modif->setCategorie($_POST['categorie']);
        }
        if ($_POST['prix'] != '') {
            $modif->setPrix($_POST['prix']);
        }
        if ($_POST['description'] != '') {
            $modif->setDescription($_POST['description']);
        }
        if ($_POST['photo'] != '') {
            $modif->setphoto($_POST['photo']);
        }
        if ($_POST['caracteristiques'] != '') {
            $modif->setCaracteristiques($_POST['caracteristiques']);
        }
        if ($_POST['stock'] != '') {
            $modif->setStock($_POST['stock']);
        }
        if ($_POST['photo_url'] != '') {
            $modif->setPhotoUrl($_POST['photo_url']);
        }
        if ($_POST['supprimer'] == 'supprimer') {
            $entityManager->remove($modif);
        }

        $entityManager->flush();
        return new Response('changement effectué avec succés hehe'. $_POST['id']);
    }

    public function DeleteArticle(string $id = null, EntityManagerInterface $entityManager): Response
    {
        if ($id === null || $id === '') {
            $id = 1;
        } else {
            $id = (int)$id;
        }

        $modif = $entityManager->getRepository(Article::class)->find($id);
        if (!$modif) {
            throw $this->createNotFoundException(
                'No product found for id '.$id
            );
        }

        $entityManager->remove($modif);
        $entityManager->flush();

        return new Response('changement effectué avec succés hehe'. $_POST['id']);
    }
}