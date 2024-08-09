<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Categorie;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;


class ModifyCategoriesController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function showCategories(): JsonResponse
    {
        $repository = $this->entityManager->getRepository(Categorie::class);
        $categories = $repository->findAll();
    
        $categoriesData = [];
        foreach ($categories as $categorie) {
            $categoriesData[] = [
                'id' => $categorie->getId(),
                'categorie' => $categorie->getCategorie(),
            ];
        }
    
        return new JsonResponse($categoriesData);
    }

    public function addCategory(Request $request): JsonResponse
    {
        $categoryName = $request->request->get('categoryName');
    
        if (!empty($categoryName)) {
            $newCategory = new Categorie();
            $newCategory->setCategorie($categoryName);
    
            $this->entityManager->persist($newCategory);
            $this->entityManager->flush();
    
            $repository = $this->entityManager->getRepository(Categorie::class);
            $categories = $repository->findAll();
    
            return new JsonResponse(['success' => true, 'categories' => $categories]);
        } else {
            return new JsonResponse(['success' => false, 'message' => 'Le nom de la catégorie ne peut pas être vide.']);
        }
    }

    public function deleteCategory(Request $request, int $categoryId): JsonResponse
{
    $repository = $this->entityManager->getRepository(Categorie::class);
    $category = $repository->find($categoryId);

    if (!$category) {
        return new JsonResponse(['success' => false, 'message' => 'La catégorie spécifiée n\'existe pas.']);
    }

    $this->entityManager->remove($category);
    $this->entityManager->flush();

    $categories = $repository->findAll();

    return new JsonResponse(['success' => true, 'categories' => $categories]);
}
    
}
