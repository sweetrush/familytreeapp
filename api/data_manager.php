<?php
class DataManager {
    private $storageFile = '../data/family.json';

    public function __construct() {
        $this->ensureDataFileExists();
    }

    private function ensureDataFileExists() {
        if (!file_exists($this->storageFile)) {
            $this->saveData([]);
        }
    }

    public function loadData() {
        $content = file_get_contents($this->storageFile);
        $data = json_decode($content, true);
        return $data ? $data : [];
    }

    public function saveData($data) {
        $json = json_encode($data, JSON_PRETTY_PRINT);
        file_put_contents($this->storageFile, $json);
    }

    public function addMember($name, $dob, $location, $fatherId = null, $motherId = null) {
        $members = $this->loadData();
        $newMember = [
            'id' => uniqid(),
            'name' => $name,
            'dob' => $dob,
            'location' => $location,
            'fatherId' => $fatherId,
            'motherId' => $motherId,
            'createdAt' => date('c')
        ];
        $members[] = $newMember;
        $this->saveData($members);
        return $newMember;
    }

    public function updateMember($id, $updates) {
        $members = $this->loadData();
        foreach ($members as &$member) {
            if ($member['id'] === $id) {
                foreach ($updates as $key => $value) {
                    if (array_key_exists($key, $member) && $key !== 'id') {
                        $member[$key] = $value;
                    }
                }
                $this->saveData($members);
                return $member;
            }
        }
        return null;
    }

    public function deleteMember($id) {
        $members = $this->loadData();
        $members = array_filter($members, function($m) use ($id) {
            return $m['id'] !== $id;
        });
        $this->saveData(array_values($members));
    }

    public function getMembers() {
        return $this->loadData();
    }

    public function getMemberById($id) {
        $members = $this->loadData();
        foreach ($members as $member) {
            if ($member['id'] === $id) {
                return $member;
            }
        }
        return null;
    }

    public function getPotentialParents() {
        $members = $this->loadData();
        return array_filter($members, function($m) {
            return empty($m['fatherId']) && empty($m['motherId']);
        });
    }
}
?>