<?php

namespace App\Http\Controllers;

use App\Employe;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class EmployeController extends Controller
{
    public function index() {
        $employes = Employe::with('departement')->get();
        return $employes;
    }

    public function faces() {
        $employes = Employe::all();
        $faces = array();
        foreach($employes as $employe){
            $face = array();
            $face['id'] = $employe['id'];
            $face['nom'] = $employe['id'].' '.$employe['nom'].' '.$employe['prenom'];
            $face['face'] = $employe['photo'];
            array_push($faces, $face);
        }
        return $faces;
    }

    public function store(Request $request) {
        $exploded = explode(',', $request->photo);
        $decoded = base64_decode($exploded[1]);

        if(Str::contains($exploded[0], 'jpeg'))
            $extension = 'jpg';
        else
            $extension ='png';

        $fileName = Str::random().'.'.$extension;
        $mkdirpath=public_path().'/storage/employes/'.$request->nom.'_'.$request->prenom;
        $path = public_path().'/storage/employes/'.$request->nom.'_'.$request->prenom.'/'.$fileName; // change it to public_path().'/storage/employes/'.$request->nom.'_'.$request->elfid.'/'.$fileName
        $photoPath = 'storage/employes/'.$request->nom.'_'.$request->prenom.'/'.$fileName;
        $admin = null;
        if($request['isAdmin'] == false){
            $admin = 'NotAdmin';
        }else if($request['isAdmin'] == true) {
            $admin = 'Admin';
        }
        if($admin != null) {
            $user = User::create([
                'name' => $request['nom'] . ' ' . $request['prenom'],
                'email' => $request['email'],
                'password' => bcrypt($request['nom'] . $request['prenom'])
            ]);
            $res = Employe::create([
                'nom' => $request['nom'],
                'prenom' => $request['prenom'],
                'sexe' => $request['sexe'],
                'email' => $request['email'],
                'departement_id' => $request['departement'],
                'photo' => $photoPath,
                'dateNaissance' => $request['date'],
                'isAdmin' => $admin,
                'user_id' => $user['id']
            ]);
        }else{
            $res = Employe::create([
                'nom' => $request['nom'],
                'prenom' => $request['prenom'],
                'sexe' => $request['sexe'],
                'email' => $request['email'],
                'departement_id' => $request['departement'],
                'photo' => $photoPath,
                'dateNaissance' => $request['date'],
                'isAdmin' => $admin
            ]);
        }

        if($res != null){
            mkdir($mkdirpath,0777,TRUE);
            file_put_contents($path, $decoded);
        }
        else{
            echo 'file not created (the error is in the employee creation)';
        }
        // array_push($res, $user);
        if($res != null){
            echo "employe est créés";
        }
        else{
            if($user != null){
                echo "user et employer sont créés";
            }
            else{
                echo "employer est créé mais par le compte user";
            }
        }
    }

    public function create() {
     //
    }

    public function edit($id) {
        $employes = array();
        $employe = Employe::with('departement')->find($id);
        array_push($employes, $employe);
        return $employes;
    }

    public function update(Request $request, $id) {
        $employe = Employe::find($id);
        $employe->update($request->all());
        return response()->json(['message'=>'ca marche']);
    }

    public function destroy($id) {
        $employe = Employe::find($id);

        if($employe->delete()){
            return $this->refresh();
        }
        else{
            return response()->json(['error' => 'Delete method has failes'], 425);
        }

    }

    private function refresh()
    {
        $employes = Employe::orderBy('created_at', 'Desc');
        return response()->json($employes);
    }
}
